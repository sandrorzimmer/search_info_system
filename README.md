# SEARCH INFO SYSTEM

### Search Info System is intended to easily save and search pieces of information.

## Why did I develop this system?

I am currently working as a Safety Engineer. My work demands me writing papers about safety evaluations in workplaces. Many times, these papers have very similar conclusions than others previously written. So, I have to write similar texts many times, in different documents.

Intending to have a good standard and avoiding the hassle of remembering and writing many times the same piece of text, I came up with the idea of creating a system where I could easily save, find and copy pieces of text that are frequently written in my documents.

To make an easier comprehension, from now on we will call every piece of information stored in the system as "info".

## Distinctiveness and complexity

This project is designed in three main parts, as the majority of softwares: 
- FRONT-END: this is what users will see and where they will interact with the system. It is clean and intuitive. It was designed using HTML 5, CSS 3, JavaScript and Bootstrap.
- BACK-END: this is what happens behind the curtains. Every time a user search for information or add some new info or tag, Django will act using Python to access the database and read or write information. I used Django REST framework to build an web API to save and access data in the database in a safe and easy way.
- DATABASE: this is where all data is stored. I used Django models to create tables to store users, infos and tags. These structures are related to each other in order to show only info that belongs to the current user and to relate info with tags.
  
The main idea behind this project is keeping it simple to use. It does not mean that it is a basic project. A good system is the one where the user learns how to manage just looking and using it. In other words, it is not necessary to think much. It must be straight forward.

If you want to make a search, just type a word and press enter.

If you want to store some data, click new info.

If you want to edit something, click edit.

Delete something? Click delete.

Copy text? Just click on the text.

Simple like that.

But, to all these features work properly, we have to program every response of the system. First, think about what your user need, later, tell your project how to do that.

All features were thought to make users find info quickly and with only few clicks. For example:
- When you arrive to the home page, focus is set to search field.
- After a search, focus is back to search field, so you can quickly make a new search.
- To perform a search, you can click on Search button or just press Enter on keyboard.
- For a new search, just press Esc and you are ready to type a new keyword.
- Once you have a list of infos, it is possible to scroll and click anyone you need to copy.

## How to run the application

In order to make it work, we have to follow few steps:

1. Install Python 3.
2. Install Django.
3. Install Django REST framework.
4. Download the project to the computer.
5. Start the server.
6. Open localhost:8000 on the browser to view the app.
7. Create a new user clicking on the link "Register here".
8. Log in with the user created.
9. Start using the system. You can create your first tags and insert your first info. After that, you will be able to search for that information in the system.

You can also refer to the file "requirements.txt" to check which packages were installed.

## Search

Users can search for an info using keywords and tags.
Every info may have a title, a body and some tags.

![Home page](/images/home_screen.png)

## Search by keyword

To do so, users just need to type a keyword in the search field and click on Search button or press Enter on keyboard. The result will be a list of all pieces of information with the specified keyword, both in the title or in the body text.

![Search field](/images/search_field.png)

## Search using tags

To restrict a search to a specific subject, users can select a tag and then type the keyword. The result will all pieces of info with the keyword and the selected tag. When “ALL” tag is selected, the system will return info from any tag, or even with no tag at all.

![Tags](/images/tags.png)

## Tags

Tags are designed to separate information by subject. The current tags are shown in the left side, in a button shape. To manage current tags, create a new one or delete some of them, users must use “Edit tags” button on top of page.

## New tag

In order to create a new tag, click on “Edit tags”, type the new one in the “New tag” field and press the green button attached to the field. The system will send the user back to home page and the new tag will appear in the tags list.

## Edit tag

To edit a tag, click on “Edit tags” and click on the pencil icon with the intended tag. A new field will appear, with the name of the tag. Edit the tag and click Save. The list of tags to be edited will be updated with the change. Pressing Ok button in the end of the list will save all changes and send user back to home page.

![Edit tags](/images/edit_tags.png)

![Editing a tag](/images/editing_tag.png)

## Delete tag

If users want to delete a tag, they just have to go to edit tags page, click in the pencil, like the way to edit the tag, and press “Delete tag” button. The system will ask for confirmation to delete and then the tag will be removed from system. All info related to that tag will remain, but now without the deleted tag.

## New Info

To create a new info, users must click on “New info” button on the top of the page, type a title (or not, it is not mandatory) and a text for the info body. Press Save and it is created.

![New info](/images/new_info.png)

## Edit Info

When an info is shown, it comes inside a white box. If users hover the cursor over this box, it becomes blue and an Edit button is shown on right side, in the bottom. If users click on this button, they will be able to change info title or body and save it. It is also possible to delete that specific info pressing Delete info button and confirming the exclusion.

![Edit info button](/images/edit_info_button.png)

![Edit info](/images/edit_info.png)

## Delete Info

As explained above, deleting an info is possible clicking the Edit button and pressing Delete info button.

## Copy Info

When users hover cursor over the info and its box becomes blue, we can notice that the cursor turns into a hand cursor. This means that there is an action possible over the box. If users click on the info box, the body text will be copied to the clipboard. Every time users click on an different info box, the clipboard content is updated to the last info clicked.

## Users

It is important to notice that evey user is only able to see his own information. If you store an info and log in with other user name, that info will not be visible. Each user is independent to manage his tags and infos.

## Future improvements

There are always room to make a system better.

- Better scrolling system for the list of info found after a search.
- When you click on Edit button, that info is also coppied to clipboard (and it should not be this way).
- Solve some issues with front-end when the screen is resized.
- Better layout for mobile screens.
- Better position for alert box.
- Make a color scheme to differ tags.
- And probably many other improvements that we will come up with while using the system.
