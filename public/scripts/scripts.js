document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    // Ecouteur d'événement pour les likes
    const likeBtns = document.querySelectorAll('.likeBtn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const postId = this.dataset.id;
            const username = this.parentNode.querySelector('.pseudo').value;
            socket.emit('like', { postId, username });
        });
    });

    // Ecouteur d'événement pour les dislikes
    const dislikeBtns = document.querySelectorAll('.dislikeBtn');
    dislikeBtns.forEach(btn => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const postId = this.dataset.id;
            const username = this.parentNode.querySelector('.pseudo').value;
            socket.emit('dislike', { postId, username });
        });
    });

    // Mettre à jour le nombre de likes
    socket.on('updateLike', function(data) {
        const postId = data.postId;
        const likesCount = data.likesCount;
        const action = data.action;
        document.getElementById('likes-' + postId).textContent = likesCount;
        
        if (action == 'like') {
            // Modifier le style de tous les boutons 'like' et 'dislike' pour cette publication
            document.querySelectorAll('.likeBtn[data-id="' + postId + '"]').forEach(function(btn) {
                btn.style.display = 'none';
            });
            document.querySelectorAll('.dislikeBtn[data-id="' + postId + '"]').forEach(function(btn) {
                btn.style.display = 'block';
            });
        } else if (action == 'dislike') {
            // Modifier le style de tous les boutons 'like' et 'dislike' pour cette publication
            document.querySelectorAll('.likeBtn[data-id="' + postId + '"]').forEach(function(btn) {
                btn.style.display = 'block';
            });
            document.querySelectorAll('.dislikeBtn[data-id="' + postId + '"]').forEach(function(btn) {
                btn.style.display = 'none';
            });
        }
    });

});