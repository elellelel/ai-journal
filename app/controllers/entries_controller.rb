class EntriesController < ApplicationController
  before_action :set_entry, only: [:show, :edit, :update, :destroy]

  def index
    user = User.find(params[:user_id]) if params[:user_id]
    user ||= current_user # Fallback to current_user if no user_id is passed

    @entries = user.entries.page(params[:page]).per(10)
    @serialized_entries = ActiveModelSerializers::SerializableResource.new(@entries)

    if request.format.json?
      render json: {
        entries: ActiveModelSerializers::SerializableResource.new(@entries),
        total_pages: @entries.total_pages
      }
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
    @existing_entries = current_user.entries
  end

  # POST /entries
  def create   
    @entry = current_user.entries.new(entry_params)

    if @entry.save
      respond_to do |format|
        format.html { redirect_to user_entry_path(current_user, @entry), notice: 'Entry was successfully created.' }
        format.json { render json: { entry: { id: @entry.id, title: @entry.title } }, status: :created }
      end
    else
      @existing_entries = Entry.all

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
