class EntriesController < ApplicationController
  before_action :set_entry, only: [:show, :edit, :update, :destroy]

  def index
    user = User.find(params[:user_id]) if params[:user_id]
    user ||= current_user # Fallback to current_user if no user_id is passed

    if params[:page]
      @entries = user.entries.page(params[:page]).per(10)
    else
      @entries = user.entries 
    end

    @serialized_entries = ActiveModelSerializers::SerializableResource.new(@entries)

    response = {
      entries: ActiveModelSerializers::SerializableResource.new(@entries)
    }

    response[:total_pages] = @entries.total_pages if params[:page]

    if request.format.json?
      render json: response
    else
      render :index
    end
  end

  # GET /entries/:id
  def show
  end

  # GET /entries/new
  def new
    @entry = current_user.entries.new
    @existing_entries = current_user.entries.reject { |e| e.id.nil? }
    @serialized_entries = ActiveModelSerializers::SerializableResource.new(@existing_entries)
  end

  # POST /entries
  def create   
    @entry = current_user.entries.new(entry_params)

    if params[:entry][:linked_entry_ids]
      @entry.linked_entry_ids = params[:entry][:linked_entry_ids].reject(&:blank?).map(&:to_i)
    end

    if @entry.save
      if params[:entry][:generate_ai_response]
        # generate content from all included entries
        content = EntryFeedCreator.new([@entry.id] + @entry.linked_entry_ids).create_feed

        response = OpenaiService.generate_response(content)
        

        paragraphs = response.split("\n").reject(&:blank?)
        response = paragraphs.map { |p| "<p>#{p.strip}</p>" }.join

        @entry.ai_response = AiResponse.new(content: response)
      end

      respond_to do |format|
        format.html { redirect_to user_entry_path(current_user, @entry), notice: 'Entry was successfully created.' }
        format.json { render json: { entry: { id: @entry.id, title: @entry.title } }, status: :created }
      end
    else
      @existing_entries = current_user.entries.reject { |e| e.id.nil? }
      @serialized_entries = ActiveModelSerializers::SerializableResource.new(@existing_entries)

      respond_to do |format|
        format.html { render :new }
        format.json { render json: { errors: @entry.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  # GET /entries/:id/edit
  def edit
  end

  # PATCH/PUT /entries/:id
  def update
    if @entry.update(entry_params)
      respond_to do |format|
        format.html { redirect_to user_entry_path(current_user, @entry), notice: 'Entry was successfully updated.' }
        format.json { render json: { entry: { id: @entry.id, title: @entry.title } }, status: :ok}
      end
    else
      respond_to do |format|
        format.html { render :edit }
        format.json { render json: { errors: @entry.errors.full_messages }, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /entries/:id
  def destroy
    if @entry.ai_response.present?
      @entry.ai_response.destroy
    end

    if @entry.destroy
      respond_to do |format|
        format.html { redirect_to root_url, notice: 'Entry was successfully destroyed.' }
        format.json { render json: { success: true, message: 'Entry was successfully destroyed.' }, status: :ok }
      end
    else
      respond_to do |format|
        format.html { redirect_to root_url, alert: 'Failed to destroy entry.' }
        format.json { render json: { success: false, message: 'Failed to destroy entry.' }, status: :unprocessable_entity }
      end
    end
  end

  private

  # Set the entry for actions that require it
  def set_entry
    @entry = Entry.find(params[:id])
  end

  # Strong parameters to permit attributes
  def entry_params
    params.require(:entry).permit(:title, :content, :linked_entry_ids)
  end
end
