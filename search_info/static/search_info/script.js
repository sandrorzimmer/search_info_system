document.addEventListener("DOMContentLoaded", function() {
    
// ------------------------------------GLOBAL VARIABLE - INFO RECEIVED FROM SEARCH
// INFO RECEIVED FROM API    
    let info_received;

// CONTAINER PARTS
    const container_search = document.querySelector("#container_search");
    const container_tags_search = document.querySelector("#container_tags_search");
    const container_tags_new_info = document.querySelector("#container_tags_new_info");
    const container_edit_tags = document.querySelector("#container_edit_tags");
    const container_result_search = document.querySelector("#container_result_search");
    const container_new_info = document.querySelector("#container_new_info");
    const container_edit_info = document.querySelector("#container_edit_info");
    const container_edit_tag = document.querySelector("#container_edit_tag");


// STARTING POINT
    goHome();

// ------------------------------------BUTTON LISTENER

    document.querySelector("#button_search").onclick = function() {
        searchInfo();
    }

    // document.querySelector("#button_edit").onclick = function() {
    //     editInfo();
    // }

    document.querySelector("#button_delete_info").onclick = function() {
        deleteInfo();
    }
    
    document.querySelector("#link_new_info").onclick = function() {
        newInfo();
    }

    document.querySelector("#link_edit_tags").onclick = function() {
        editTags();
    }

    document.querySelector("#button_save_new_info").onclick = function() {
        saveNewInfo();
    }

    document.querySelector("#button_cancel_new_info").onclick = function() {
        cancelNewInfo();
    }

    document.querySelector("#button_save_edit_info").onclick = function() {
        saveEditInfo();
    }

    document.querySelector("#button_cancel_edit_info").onclick = function() {
        cancelEditInfo();
    }

    document.querySelector("#button_save_new_tag").onclick = function() {
        saveNewTag();
    }

    document.querySelector("#button_save_edit_tag").onclick = function() {
        saveEditTag();
    }

    document.querySelector("#button_delete_tag").onclick = function() {
        deleteTag();
    }

    document.querySelector("#button_cancel_edit_tag").onclick = function() {
        cancelEditTag();
    }

    document.querySelectorAll(".btn-edit-tag").forEach(button => {
        button.onclick = function() {
            tag_text = document.querySelector("#input_tags_list_" + this.dataset.tag_id).value;
            editThisTag(this.dataset.tag_id,tag_text);
        }
    })

    document.querySelector("#button_ok_edit_tags").onclick = function() {
        okEditTags();
    }
    
    // --------------------------------KEYBOARD SHORTCUT KEYS LISTENER

    window.addEventListener("keydown", function(event) {
        if (event.defaultPrevented) {
          return; // Do nothing if event already handled
        }
      
        switch(event.code) {
            case "Enter":
            case "NumpadEnter":
                if (document.querySelector("#input_search") === document.activeElement) {
                    searchInfo();
                    break;                  
                }
                break;

            case "Escape":
                goHome();
                break;

            case "ArrowDown":
                focusResult();
                break;                
                
            case "ArrowRight":
                //nextInfo();
                break;

            case "ArrowLeft":
                //previousInfo();
                break;
        }
        return;
    })
});

// ------------------------------------FUNCTIONS

// ------------------------------------GENERAL FUNCTIONS

function hideAll() {
    const element = document.querySelectorAll("div.s_block");
    for (let x = 0; x < element.length; x++) {
        element[x].style.display = "none";
    }
    return;
}

// ------------------------------------CLEAR ALL INPUT FIELDS
function clearFields() {
    document.querySelectorAll('.s_input_field').forEach(input_field => input_field.value = "");
    document.querySelectorAll('.tags_new_info').forEach(checkbox_tag => checkbox_tag.checked = false);
    return;
}

// ------------------------------------GO TO HOME PAGE
function goHome() {
    hideAll();
    clearFields();
    container_tags_search.style.display = "block";
    document.querySelector("#input_search").focus();
    return;
}

function focusResult() {
    console.log("clicou arrow down");

    let counter = 0;
    const s_div = document.querySelectorAll(".s_div_info_search");

    s_div[counter].focus();

    counter += 1;

    return;
}

// ------------------------------------SHOW ALERT BOX
function showAlert(type,text) {
    const alert_box = document.querySelector("#alert_box");
    alert_box.removeAttribute("class");
    switch (type) {
        case "success":
            alert_box.classList.add("s_block", "alert", "alert-success", "mt-3");
            alert_box.innerHTML = text;
            alert_box.style.display = "block";
            setTimeout( function(){alert_box.style.display = "none";} , 4000);
            break;
        case "danger":
            alert_box.classList.add("s_block", "alert", "alert-danger", "mt-3");
            alert_box.innerHTML = text;
            alert_box.style.display = "block";
            setTimeout( function(){alert_box.style.display = "none";} , 4000);
            break;
        case "info":
            alert_box.classList.add("s_block", "alert", "alert-info", "mt-3");
            alert_box.innerHTML = text;
            alert_box.style.display = "block";
            setTimeout( function(){alert_box.style.display = "none";} , 4000);
            break;            
    }
}

// ------------------------------------GET COOKIE INFORMATION
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ------------------------------------BUTTON FUNCTIONS

function searchInfo() {
    hideAll();

    const keyword = document.querySelector("#input_search").value;
    const tag = document.querySelector("input[name=tags_search]:checked").value;

    if (tag == "all") {
        // Test if field is empty
        if (keyword == "") {
            //hideAll();
            container_tags_search.style.display = "block";
            showAlert("danger","Please, enter a keyword to search for or select a tag different than ALL.")
            return false;
        }        
    }

    // Send data to API
    fetch('/search_info/search_info?keyword=' + keyword + '&tag=' + tag)
    .then(response => response.json())
    .then(result => {
        if (!result.error) {
            const info = result;
            if (info.length == 0) {
                container_tags_search.style.display = "block";
                showAlert("danger","Sorry, your search has no results.");
                return;
            } else {

                container_result_search.innerHTML = "";

                result.forEach(info => {
                    const info_div = document.createElement("div");
                    const header_element = document.createElement("h4");
                    const header_text = document.createTextNode(info.title);
                    const info_element = document.createElement("div");
                    const info_text = document.createTextNode(info.text);
                    const toolbar = document.createElement("div");

                    const button = document.createElement("button");
                    button.type = "button";
                    button.innerHTML = "Edit";
                    button.classList.add("btn-edit-info", "btn", "btn-outline-light", "btn-sm", "opacity-50", "float-end");
                    button.dataset.title = info.title;
                    button.dataset.text = info.text;
                    button.dataset.id = info.id;
                    button.dataset.tags_id = info.tags_id;
                    button.tabIndex = "-1";

                    info_div.classList.add("s_div_info_search", "container", "border", "mb-3", "py-2");
                    header_element.classList.add("result_info_search_title");
                    info_element.classList.add("s_info_text");
                    toolbar.classList.add("d-block", "my-2");

                    header_element.appendChild(header_text);
                    info_element.appendChild(info_text);

                    info_div.tabIndex = "0";
                    info_div.appendChild(header_element);
                    info_div.appendChild(info_element);
                    info_div.appendChild(toolbar);                

                    // Show info tags
                    info.tags.forEach(tag => {
                        const span_tag = document.createElement("span");
                        span_tag.classList.add("badge", "bg-light", "text-dark", "opacity-50");
                        const node = document.createTextNode(tag);
                        span_tag.appendChild(node);
                        toolbar.appendChild(span_tag);
                    })

                    toolbar.appendChild(button);

                    container_result_search.appendChild(info_div);

                })

                container_tags_search.style.display = "block";
                container_result_search.style.display = "block";

                document.querySelectorAll(".btn-edit-info").forEach(button => {
                    button.onclick = function() {
                        editInfo(this.dataset.title,this.dataset.text,this.dataset.id,this.dataset.tags_id);
                    }
                })

                document.querySelectorAll(".s_div_info_search").forEach(div => {
                    div.onclick = function() {
                        const text = div.querySelector(".s_info_text").innerHTML;
                        copyInfo(text);
                    }
                })

                return;
            }

        }
        else {
            return false;
        }
    })
    return false;
}

// ------------------------------------BUTTON - COPY
function copyInfo(text) {
    navigator.clipboard.writeText(text).then(function() {
        showAlert("info","Text copied.");
    }, function() {
        showAlert("danger","Sorry, there was a problem to copy your text.");
    });
    return;
}

// ------------------------------------BUTTON - EDIT
function editInfo(title,text,id,tags_id) {
    hideAll();

    // const title = document.querySelector("#result_info_search_title").innerHTML;
    // const text = document.querySelector("#result_info_search_text").innerHTML;
    // const id = document.querySelector("#result_info_id").value;
    // const tags_id = document.querySelector("#result_info_search_tags_id").value;

    document.querySelector("#input_edit_info_title").value = title;
    document.querySelector("#ta_edit_info_text").value = text;
    document.querySelector("#edit_info_id").value = id;
    document.querySelector("#edit_info_tags_id").value = tags_id;

    // Check info tags
    const tags_new_info = document.getElementsByName("tags_new_info");
    const tags_id_array = tags_id.split(",");
    for (let i=0; i<tags_new_info.length; i++) {
        if (tags_id_array.includes(tags_new_info[i].value) == true) {
            tags_new_info[i].checked = true;
        }
    }

    container_tags_new_info.style.display = "block";
    container_edit_info.style.display = "block";

    return;
}

// ------------------------------------BUTTON - DELETE
function deleteInfo() {
    let confirmation = confirm("Do you want to delete this item?");
    if (confirmation != true) {
        return false;
    }
    const info_id = document.querySelector("#edit_info_id").value;

        // Get csrf token using getCookie function
        const csrftoken = getCookie("csrftoken");

        // Send data to API
        fetch('/search_info/delete_info', {
            method:'POST',
            headers:{"X-CSRFToken": csrftoken},
            body: JSON.stringify({
                info_id: info_id
            })
        })
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                goHome();
                showAlert("success",result.message);
                return;
            }
            else {
                return false;
            }
        })
        return false;
}

// ------------------------------------BUTTON - NEW
function newInfo() {
    hideAll();
    clearFields();
    container_tags_new_info.style.display = "block";    
    container_new_info.style.display = "block";
    document.querySelector('#input_new_info_title').focus();
    return;
}

// ------------------------------------BUTTON - SAVE NEW INFO
function saveNewInfo() {
    // Get field values
    // Info title and text
    const info_title = document.querySelector('#input_new_info_title').value;
    const info_text = document.querySelector('#ta_new_info_text').value;
    // Info tags
    let checked_tags = [];
    const tags_new_info = document.getElementsByName("tags_new_info");
    for (let i=0; i<tags_new_info.length; i++) {
        if (tags_new_info[i].checked) {
            let tag_id = parseInt(tags_new_info[i].value);
            checked_tags.push(tag_id);
        }
    }

    // Test if field is empty
    if (info_text == "") {
        showAlert("danger","Info content cannot be empty.")
        return false;
    }

    // Test if at least one tag is checked
    if (checked_tags.length <= 0) {
        let confirmation = confirm("You haven't checked any tag. Do you want to proceed with no tags?");
        if (confirmation != true) {
            return false;
        }
    }

    // Get csrf token using getCookie function
    const csrftoken = getCookie("csrftoken");

    // Send data to API
    fetch('/search_info/new_info', {
        method:'POST',
        headers:{"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            info_title: info_title,
            info_text: info_text,
            checked_tags: checked_tags
        })
    })
    .then(response => response.json())
    .then(result => {
        if (!result.error) {
            showAlert("success",result.message);
            document.querySelector('#input_new_info_title').value = "";
            document.querySelector('#ta_new_info_text').value = "";
            document.querySelector('#input_new_info_title').focus();
            return true;
        }
        else {
            return false;
        }
    })
    return false;
}

// ------------------------------------BUTTON - CANCEL NEW INFO
function cancelNewInfo() {
    goHome();
    return;
}

// ------------------------------------BUTTON - SAVE EDIT INFO
function saveEditInfo() {
    // Get field values
    // Info title, text and id
    const info_title = document.querySelector('#input_edit_info_title').value;
    const info_text = document.querySelector('#ta_edit_info_text').value;
    const info_id = document.querySelector("#edit_info_id").value;
    // Info tags
    let checked_tags = [];
    const tags_new_info = document.getElementsByName("tags_new_info");
    for (let i=0; i<tags_new_info.length; i++) {
        if (tags_new_info[i].checked) {
            let tag_id = parseInt(tags_new_info[i].value);
            checked_tags.push(tag_id);
        }
    }

    // Test if field is empty
    if (info_text == "") {
        return false;
    }

    // Get csrf token using getCookie function
    const csrftoken = getCookie("csrftoken");

    // Send data to API
    fetch('/search_info/edit_info', {
        method:'POST',
        headers:{"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            info_title: info_title,
            info_text: info_text,
            checked_tags: checked_tags,
            info_id: info_id
        })
    })
    .then(response => response.json())
    .then(result => {
        if (!result.error) {
            showAlert("success",result.message);
            return true;
        }
        else {
            return false;
        }
    })
    return false;
}

// ------------------------------------BUTTON - CANCEL EDIT INFO
function cancelEditInfo() {
    goHome();
    return;
}

// ------------------------------------BUTTON - SAVE NEW TAG
function saveNewTag() {
    // Get field values
    const tag_text = document.querySelector('#input_new_tag').value;

    // Test if filed is empty
    if (tag_text == "") {
        showAlert("danger","Sorry, tag cannot be empty.");
        return false;
    }

    // Get csrf token using getCookie function
    const csrftoken = getCookie("csrftoken");

    // Send data to API
    fetch('/search_info/new_tag', {
        method:'POST',
        headers:{"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            tag_text: tag_text
        })
    })
    .then(response => response.json())
    .then(result => {
        if (!result.error) {
            window.location.reload();
            return;
        }
        else {
            return false;
        }
    })
    return false;
}

// ------------------------------------BUTTON - EDIT TAGS
function editTags() {
    hideAll();
    container_edit_tags.style.display = "block";
    document.querySelectorAll(".s_edit_tags").forEach(tag => {
        tag.style.opacity = "1";
    })
    document.querySelector("#input_new_tag").focus();
    return;
}

// ------------------------------------BUTTON - EDIT THIS TAG (FOR EVERY TAG)
function editThisTag(tag_id,tag_text) {
    container_edit_tag.style.display = "block";
    document.querySelector("#input_edit_tag").value = tag_text;
    document.querySelector("#input_edit_tag_id").value = tag_id;
    document.querySelector("#input_edit_tag").focus();
    document.querySelectorAll(".s_edit_tags").forEach(tag => {
        tag.style.opacity = "0.2";
    })
    document.querySelector("#edit_tags_tag_id_" + tag_id).style.opacity = "1";
}

// ------------------------------------BUTTON - SAVE EDIT TAG
function saveEditTag() {
    // Get field values
    const tag_text = document.querySelector('#input_edit_tag').value;
    const tag_id = document.querySelector("#input_edit_tag_id").value;

    // Test if field is empty
    if (tag_text == "") {
        showAlert("danger","Sorry, tag cannot be empty.");
        return false;
    }

    // Get csrf token using getCookie function
    const csrftoken = getCookie("csrftoken");

    // Send data to API
    fetch('/search_info/edit_tag', {
        method:'POST',
        headers:{"X-CSRFToken": csrftoken},
        body: JSON.stringify({
            tag_text: tag_text,
            tag_id: tag_id
        })
    })
    .then(response => response.json())
    .then(result => {
        if (!result.error) {
            showAlert("success",result.message);
            cancelEditTag();
            document.querySelector("#input_tags_list_" + tag_id).value = tag_text;
            return true;
        }
        else {
            return false;
        }
    })
    return false;
}

// ------------------------------------BUTTON - DELETE TAG
function deleteTag() {
    let confirmation = confirm("Do you want to delete this tag?");
    if (confirmation != true) {
        return false;
    }
    const tag_id = document.querySelector("#input_edit_tag_id").value;

        // Get csrf token using getCookie function
        const csrftoken = getCookie("csrftoken");

        // Send data to API
        fetch('/search_info/delete_tag', {
            method:'POST',
            headers:{"X-CSRFToken": csrftoken},
            body: JSON.stringify({
                tag_id: tag_id
            })
        })
        .then(response => response.json())
        .then(result => {
            if (!result.error) {
                window.location.reload();
                return;
            }
            else {
                return false;
            }
        })
        return false;
}

// ------------------------------------BUTTON - CANCEL EDIT TAG
function cancelEditTag() {
    document.querySelector("#input_edit_tag").value = "";
    document.querySelector("#input_edit_tag_id").value = "";
    container_edit_tag.style.display = "none";
    document.querySelectorAll(".s_edit_tags").forEach(tag => {
        tag.style.opacity = "1";
    })
    return;
}

// ------------------------------------BUTTON - OK EDIT TAGS
function okEditTags() {
    window.location.reload();
    return;
}