
class FileLoader
{
    constructor (file_name, callback)
    {
        this.file_name = file_name;
      //  this.read_file(this.file_name, callback);
    }

    read_file = function(file_name, callback)
    {
        fetch(file_name, {mode: 'no-cors'})
        .then(response => response.text())
        .then(data => callback(data))
        .catch(error => alert(error));
    }
}
