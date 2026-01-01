# Database tidyup

I need a couple of changes to the schema of the gcunhistorical database that, and so I'll need a script that can make these changes. Here are the changes. 

## Add an 'active' column to each document
Add a boolean column, defaulted to true, to each document, called 'active'. The idea is that I can toggle places by changing this value without actually deleting the documents.

## Update the category property
Places should be able to belong to more than one category, and so therefore I need the 'category' property changed to 'categories', which will be an array of strings. Keep the existing value for each place as the only element in the array.

In order to cater for this change, make any changes necessary in the components where the existing code was expecting a single string.