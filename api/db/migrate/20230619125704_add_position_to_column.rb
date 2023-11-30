class AddPositionToColumn < ActiveRecord::Migration[7.0]
  def change
    add_column :columns, :position, :integer
  end
end
