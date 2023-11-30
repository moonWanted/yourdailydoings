class Column < ApplicationRecord
  acts_as_list
  has_many :tasks 
end
