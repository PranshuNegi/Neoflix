module.exports = class Movie{
    constructor( title, image, date_of_release, rating,  num_watched, duration, genre){
        this.title = title;
        this.image = image;
        this.date_of_release = date_of_release;
        this.rating = rating;
        this.num_watched = num_watched;
        this.duration = duration;
        this.genre = genre;
    }

};