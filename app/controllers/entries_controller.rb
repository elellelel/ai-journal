class EntriesController < ApplicationController
  before_action :set_entry, only: [:show, :edit, :update, :destroy]

  def index
    @entries = current_user.entries
  end

  # GET /entries/:id
  def show
  end

  # GET /entries/new
  def new
    @entry = current_user.entries.new
    @existing_entries = Entry.all
  end

  # POST /entries
  def create
    @entry = current_user.entries.new(entry_params)

    if params[:entry][:linked_entry_ids]
      @entry.linked_entry_ids = params[:entry][:linked_entry_ids].reject(&:blank?).map(&:to_i)
    end

    if params[:generate_ai_response]
      # generate content from all included entries
      # lol just feed it all in as one big string this is a great idea
      content = current_user.entries.where(id: @entry.linked_entry_ids).map(&:content).join(" ")
      response = OpenaiService.generate_response(entry_params[:content] + content)
      @entry.ai_response = AiResponse.new(content: response)
    end

    if @entry.save
      redirect_to @entry, notice: 'Entry was successfully created.'
    else
      @existing_entries = Entry.all
      render :new
    end
  end

  # GET /entries/:id/edit
  def edit
  end

  # PATCH/PUT /entries/:id
  def update
    if @entry.update(entry_params)
      redirect_to @entry, notice: 'Entry was successfully updated.'
    else
      render :edit
    end
  end

  # DELETE /entries/:id
  def destroy
    if @entry.ai_response.present?
      @entry.ai_response.destroy
    end
    
    @entry.destroy
    redirect_to root_url, notice: 'Entry was successfully destroyed.'
  end

  private

  # Set the entry for actions that require it
  def set_entry
    @entry = Entry.find(params[:id])
  end

  # Strong parameters to permit attributes
  def entry_params
    params.require(:entry).permit(:title, :content)
  end
end
