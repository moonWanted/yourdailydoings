# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

columns = Column.create([{ title: "To Do", position: 1 }, { title: "In Progress", position: 2 }, { title: "Done", position: 3 }])

tasks = Task.create([
    { content: "Create a new task", position: 1, column_id: columns[0].id },
    { content: "Update a task", position: 1, column_id: columns[1].id },
    { content: "Create a new column", position: 2, column_id: columns[0].id },
    { content: "Update a column", position: 2, column_id: columns[1].id },
    { content: "Create a new task", position: 3, column_id: columns[0].id },
    { content: "Update a task", position: 3, column_id: columns[1].id },
])
