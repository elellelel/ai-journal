class EntriesController < ApplicationController
  before_action :set_entry, only: [:show, :edit, :update, :destroy]

  def index
    @entries = Entry.all
  end

  # GET /entries/:id
  def show
  end

  # GET /entries/new
  def new
    @entry = Entry.new
  end

  # POST /entries
  def create
    @entry = Entry.new(entry_params)

    if params[:generate_ai_response]
      response = OpenaiService.generate_response(entry_params[:content])
      @entry.ai_response = AiResponse.new(content: response)
    end

    if @entry.save
      redirect_to @entry, notice: 'Entry was successfully created.'
    else
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
