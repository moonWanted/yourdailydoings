module Api
  module V1
    class ColumnsController < ApplicationController
      def index
        columns = Column.all

        # render json: ColumnSerializer.new(columns, options).serialized_json
        render json: columns.to_json(include: [:tasks])
      end

      # def show
      #   column = Column.find(params[:id])
      #   render json: {status: 'SUCCESS', message:'Loaded column', data:column},status: :ok
      # end

      def create
        column = Column.new(column_params)

        if column.save
          render json: column.to_json(include: [:tasks])
        else
          render json: {status: 'ERROR', message:'Column not saved', data:column.errors},status: :unprocessable_entity
        end
      end

      def destroy
        column = Column.find(params[:id])

        if column.destroy
          head :no_content, status: :ok
        else
          render json: {status: 'ERROR', message:'Column not deleted', data:column.errors},status: :unprocessable_entity
        end
      end

      def update
        column = Column.find(params[:id])

        begin
          if params.has_key?(:position)
            column.remove_from_list
            column.insert_at(column_params[:position].to_i)
          else
            column.update(title: column_params[:title])
          end
            render json: column.to_json(include: [:tasks])
        rescue => exception
          render json: {status: 'ERROR', message:'Column not updated', data:exception},status: :unprocessable_entity
        end
      end

      private

      def column_params
        params.permit(:title, :position)
      end

      # def options
      #   @options ||= { include: %i[tasks] }
      # end
    end
  end
end