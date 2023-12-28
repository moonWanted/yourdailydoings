module Api
  module V1
    class TasksController < ApplicationController
      # def index
      #   tasks = Task.order('created_at DESC');
      #   render json: {status: 'SUCCESS', message:'Loaded tasks', data:tasks},status: :ok
      # end

      # def show
      #   task = Task.find(params[:id])
      #   render json: {status: 'SUCCESS', message:'Loaded task', data:task},status: :ok
      # end

      def create
        task = Task.new(task_params)

        if task.save
          render json: task.to_json()
        else
          render json: {status: 'ERROR', message:'Task not saved', data:task.errors},status: :unprocessable_entity
        end
      end

      def destroy
        task = Task.find(params[:id])
        
        if task.destroy
          head :no_content, status: :ok
        else
          render json: {status: 'ERROR', message:'Task not deleted', data:task.errors},status: :unprocessable_entity
        end  
      end

      def update
        task = Task.find(params[:id])

        if task_params[:column_id].to_i == task.column_id
          begin
            task.remove_from_list
            task.insert_at(task_params[:position].to_i)
            render json: task.to_json()
          rescue => exception
            render json: {status: 'ERROR', message:'Task not updated', data:task.errors},status: :unprocessable_entity
          end
        else
          if task.update(column_id: task_params[:column_id])
            task.remove_from_list
            task.insert_at(task_params[:position].to_i)
            render json: task.to_json()
          else
            render json: {status: 'ERROR', message:'Task not updated', data:task.errors},status: :unprocessable_entity
          end
        end
        
      end

      private

      def task_params
        params.permit(:content, :position, :column_id)
      end
    end
  end
end