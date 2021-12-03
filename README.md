# Mangato API

This api is based on [manganato](https://manganato.com/) manga reading api to give you a better experience for your app.

### Built With

- [Express](https://expressjs.com/)
- [Cheerio](https://cheerio.js.org/)
- [axios](https://axios-http.com/)

## Table of Contents

**[Getting Started](#getting-started)**<br>
**[Api Walkthrough](#api-walkthrough)**<br>
**[Request & Response Examples](#request-&-response-examples)**<br>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Cloning

```
git clone https://github.com/riimuru/Mangato-api.git
cd mangato-api
```

### Installing

Install the packages and run the server.

```
npm install
npm start
```

## API Walkthrough

### Common formats

#### List / Panigation

```
[
    {
        "info": {
            "totalStories": ...,
            "totalPages": "...
        },
        "data": [
            {...},
            {...},
            ...
        ]
    }
]
```

#### Error format

```
{
    "status": 404,
    "error": "Not Found"
}
```

### Get manga list

#### Query parameters

Parameters can be used to query, filter and control the results returned by the Mangato API. They can be passed as normal query parameters.

| parameter          | description                                                                                                                                                                                                                                                       |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sts` (string)     | filter results by status. default: `Ongoing and Complete`                                                                                                                                                                                                         |
| `orby` (string)    | filter results by `Latest updates, top view, new manga, A-Z`. default: `Latest updates`                                                                                                                                                                           |
| `inGenre` (string) | filter results by genres. all genres are included by default. for example: If you include Historical , it will filter only mangas with Historical genre. (You can include multiple genres). for example: `inGenre=_15_` **NOTE: Genres list available is below.** |
| `exGenre` (string) | If you include Comedy, Romance but exclude Ecchi, it will filter all mangas with Comedy and Romance but Ecchi. for example: `inGenre=_6_27_&exGenre=_11_` **NOTE: Genres list is available below.**                                                               |
| `keyw` (string)    | filter results by manga name. for example: `keyw=one piece`                                                                                                                                                                                                       |
| `page` (int)       | by default page starts from 1.                                                                                                                                                                                                                                    |

#### Genres

Every genre have a specific value which you can put in your Get Request query. therefore here is a list of genres in ascending order.

| Genre         | Value |
| :------------ | :---- |
| Action        | 2     |
| Adult         | 3     |
| Adventure     | 4     |
| Comedy        | 6     |
| Cooking       | 7     |
| Doujinshi     | 9     |
| Drama         | 10    |
| Ecchi         | 11    |
| Fantasy       | 12    |
| Gender Bender | 13    |
| Harem         | 14    |
| Historical    | 15    |
| Horror        | 16    |
| Isekai        | 45    |
| Josei         | 17    |
| Manhua        | 44    |
| Manhwa        | 43    |
| Martial arts  | 19    |
| Mature        | 20    |
| Mecha         | 21    |
| Medical       | 22    |
| Mystery       | 24    |
| One shot      | 25    |
| Psychological | 26    |
| Romance       | 27    |
| School life   | 28    |
| Sci fi        | 29    |
| Seinen        | 30    |
| Shoujo        | 31    |
| Shoujo ai     | 32    |
| Shounen       | 33    |
| Shounen ai    | 34    |
| Slice of life | 35    |
| Smut          | 36    |
| Sports        | 37    |
| Supernatural  | 38    |
| Tragedy       | 39    |
| Webtoons      | 40    |
| Yaoi          | 41    |
| Yuri          | 42    |

## Request & Response Examples

### GET /manga_list`?sts=ongoing`

This query will filter result by status only.

Example:

```
curl 'http://localhost:3000/manga_list?sts=ongoing'
```

Response body:

```
[
    {
        "info": {
            "totalStories": "20,846",
            "totalPages": "869"
        },
        "data": [
            {
                "index": 0,
                "title": "Slave Of The Magic Capital's Elite Troops",
                "chapter": "Chapter 74: Slave And Kuusetsu",
                "img": "https://avt.mkklcdnv6temp.com/38/m/17-1583496651.jpg",
                "src": "https://readmanganato.com/manga-dp980698",
                "synopsis": "This battle fantasy manga follows several heroines who protect people from the monsters that appear through a gate connecting to an alternate world known as the Mato (magic capital).",
                "views": "30,936,143",
                "uploadedDate": "Dec 04,21",
                "authors": "Takahiro, Youhei Takemura",
                "rating": "4.7"
            },
            {
                "index": 1,
                "title": "Mofumofu To Isekai Slow Life O Mezashimasu!",
                "chapter": "Chapter 29: The Journey Of Young Orst",
                "img": "https://avt.mkklcdnv6temp.com/39/e/18-1583498616.jpg",
                "src": "https://manganato.com/manga-es982101",
                "synopsis": "The overworked Young Man fell into a hole, which leads him to another world. Now he has become a young boy named Arito and lives his life accompanied by fluffies. While being guided by an old Elf named Orst, he enjoys his new life in the magical forest.",
                "views": "6,986,875",
                "uploadedDate": "Dec 04,21",
                "authors": "Kanade,Isaza Terada,Yahako",
                "rating": "4.7"
            },
            {...},
            ...
        ]
    }
]
```

### GET /manga_list`?exGenre=_35_37&sts=completed&keyw=one piece`

This query will exclude slice of life and sports genre and filter by a completed manga and the manga title `one piece`.

Example:

```
curl 'http://localhost:3000/manga_list?sts=completed&keyw=one%20piece'
```

Response body:

```
[
    {
        "info": {
            "totalPages": ""
        },
        "data": []
    }
]
```

response is empty because one piece didnt finish yet :).

## Contributing

[Pull requests](https://github.com/riimuru/Mangato-api/pulls) are welcome. For major changes, please open an [issue](https://github.com/riimuru/Mangato-api/issues/new) first to discuss what you would like to change.

Please make sure to update tests as appropriate.
