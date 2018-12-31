let counter =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// Song class
class Song{
  
  constructor(title, artist, comment) {
    
    this.id = counter + 1;
    counter++;
    this.title = title;
    this.artist = artist;
    this.comment = comment;
  }
}

//UI class
class UI {

  addSongToList(song){
    const list = document.getElementById('song-list');
    // Create tr element
    const row = document.createElement('tr');
    // Insert columns
    row.innerHTML = `<td>${song.title}</td>
                     <td>${song.artist}</td>
                     <td>${song.comment}</td>
                     <td id="hiden">${song.id}</td>
                     <td><a href="#" class="delete">X<a></td>`;
    // Append the row to the list
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // Add class to div
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent element
    const container = document.querySelector('.container');
    // Get form
    const form = document.getElementById('song-form');
    // Insert alert
    container.insertBefore(div, form);
    // Remove alert after 3 seonds
    setTimeout(function(){
      document.querySelector('.alert').remove()
    }, 2600);
  }

  delete(target) {
    if(target.className === "delete"){
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = "";
    document.getElementById('artist').value = "";
    document.getElementById('comment').value = "";
  }
}

// Local Storage Class
class Store {
  static getSongs() {
    let songs;
    if (localStorage.getItem('songs') === null) {
      songs = [];
    } else {
      songs = JSON.parse(localStorage.getItem('songs'));
    }
    return songs;
  }

  static addSong(song) {
    const songs = Store.getSongs();
    songs.push(song);
    localStorage.setItem('songs', JSON.stringify(songs));
  }

  static displaySongs() {
    const songs = Store.getSongs();
    songs.forEach(song => {
      const ui = new UI();
      ui.addSongToList(song);
    });
  }

  static removeSong(id) {
    console.log(id);
    const songs = Store.getSongs();
    songs.forEach(function(song, index){
      if(song.id == id) {
        songs.splice(index, 1);
      }
    });
    localStorage.setItem('songs', JSON.stringify(songs));
  }
}

// Event Listener on load
document.addEventListener('DOMContentLoaded', Store.displaySongs);

// Clear all songs
document.getElementById('clear-all').addEventListener('click', () => {
  const ui = new UI();
  const list = document.getElementById('song-list');
  const table = document.getElementById('songs-table');
  if(list){
    list.innerHTML = '<tbody id="song-list"></tbody>';
    localStorage.clear();
  } else {
    ui.showAlert('Nothing to clear, the list is empty!', 'error');
  }
  
})

// Event Listener for submit
document.querySelector('#song-form').addEventListener('submit', function(e){
  const title = document.getElementById('title').value,
        artist = document.getElementById('artist').value,
        comment = document.getElementById('comment').value

  // Instantiate song      
  const song = new Song(title, artist, comment);
  // Instantiate UI 
  const ui = new UI();
  if(title ===''){
    // Alert
    ui.showAlert('Please insert a song title!', 'error');
  } else {
    ui.addSongToList(song);
    // Add to Local Storage
    console.log(song);
    Store.addSong(song);
    ui.showAlert('Song added!', 'success');
    
    ui.clearFields();
  }
  
  e.preventDefault();
});

// Event Listener for delete
document.querySelector('#song-list').addEventListener('click', function (e){
  // Instantiate UI 
  const ui = new UI();
  // Delete Song
  ui.delete(e.target);
  // Delete Song from Local Storage
  Store.removeSong(e.target.parentElement.previousElementSibling.textContent);
  // Show alert
  ui.showAlert('Song removed succesfully', 'success')

  e.preventDefault();
})
