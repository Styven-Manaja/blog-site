var edit_field = document.querySelector('.edit');
var edit_btn = document.getElementById('edit');
var edit_save = document.getElementById('save');
var comment_field = document.getElementById('comment');
var comment_btn = document.querySelector('.comment');

edit_btn.addEventListener('click', function() {
    edit_field.style.display = 'block';
    edit_btn.style.display = 'none';
});

edit_save.addEventListener('click', function() {
    edit_field.style.display = 'none';
    edit_btn.style.display = 'block';
});

comment_btn.addEventListener('click', function() {
    comment_field.focus();
});