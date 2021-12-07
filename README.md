# Mangato API

This api is based on [manganato](https://manganato.com/) manga reading api to give you a better experience for your app.

## Table of Contents

**[Getting Started](#getting-started)**<br>
**[Api Walkthrough](#api-walkthrough)**<br>
**[Request & Response Examples](#request--response-examples)**<br>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Cloning

```command
git clone https://github.com/riimuru/Mangato-api.git
cd mangato-api
```

### Installing

Install the packages and run the server.

```command
npm install
npm start
```

## API Walkthrough

### Common Formats

#### List / Pagination

```json
[
        "info": {
            "keyword": ...,
            "filter_status": ...,
             ...
        },
        "data": [
            {...},
            {...},
            ...
       ]
]
```

#### Error format

```json
{
    "status": 404,
    "error": "Not Found"
}
```

### GET /manga_list

#### Query Parameters & Headers

Parameters can be used to query, filter and control the results returned by the Mangato API. They can be passed as normal query parameters.

| Parameter          | Description                                                                                                                                                                                                                                                    |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sts` (string)     | filter results by status. default: `Ongoing and Complete`                                                                                                                                                                                                      |
| `orby` (string)    | filter results by `Latest updates, top view, new manga, A-Z`. default: `Latest updates`                                                                                                                                                                        |
| `inGenre` (string) | filter results by genres. all genres are included by default. for example: If you include Historical , it will filter only mangas with Historical genre. (You can include multiple genres). for example: `inGenre=_15_` **NOTE: Genres list available below.** |
| `exGenre` (string) | If you include Comedy, Romance but exclude Ecchi, it will filter all mangas with Comedy and Romance but Ecchi. for example: `inGenre=_6_27_&exGenre=_11_` **NOTE: Genres list available below.**                                                               |
| `keyw` (string)    | filter results by manga name. for example: `keyw=one piece`                                                                                                                                                                                                    |
| `page` (int)       | by default page starts from 1. pages limit may vary                                                                                                                                                                                                            |

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

### GET /manga_info

#### Query Parameters & Headers

manga id, host name, url can be accessed by making `GET /manga_list` request. [see examples below](#get-manga_list-1)

| Parameter            | Description             |
| :------------------- | :---------------------- |
| `id` (string)        | manga id                |
| `host-name` (string) | manga website host name |

| Header         | Description |
| :------------- | :---------- |
| `url` (string) | manga url   |

### GET /read_manga

#### Query Parameters & Headers

chapter url can be accessed by making `GET /manga_info` request. [see exmaples below](#get-manga_info-1)

| Header         | Description |
| :------------- | :---------- |
| `url` (string) | chapter url |

## Request & Response Examples

### GET /manga_list

#### Example 1:

This query will filter result by status only.

Example:

```command
curl 'http://localhost:3000/manga_list?sts=ongoing'
```

Response body:

```json
[
    {
        "info": {
            "keyword": "",
            "filter_status": "ongoing",
            "included_genres": "",
            "excluded_genres": "",
            "order_by": "",
            "current_page": 1,
            "totalStories": "20,846",
            "totalPages": "869"
        },
        "data": [
            {
                "index": 0,
                "id": "manga-jn987096",
                "title": "Hell Mode: Yarikomi Suki No Gamer Wa Hai Settei No Isekai De Musou Suru",
                "chapter": "Chapter 14: Talent",
                "img": "https://avt.mkklcdnv6temp.com/33/n/22-1604080648.jpg",
                "host_name": "manganato.com",
                "src": "https://manganato.com/manga-jn987096",
                "synopsis": "\"Will you be summoned to the world of a never-ending game?\" One day, I was looking for a new game, when I suddenly saw that ad. After choosing the most difficult mode of the game, \"hell mode\", I was suddenly reincarnated into a new world as a farmhand.  As a boy named Allen, I started my journey in another world with the highest difficulty, overcoming all challenges to ach",
                "views": "6,330,209",
                "uploadedDate": "Dec 04,21",
                "authors": "Tetta Enji,Hamuo",
                "rating": "4.8"
            },
            {
                "index": 1,
                "id": "manga-cb980036",
                "title": "The World Of Otome Games Is Tough For Mobs",
                "chapter": "Chapter 38",
                "img": "https://avt.mkklcdnv6temp.com/13/q/17-1583495755.jpg",
                "host_name": "readmanganato.com",
                "src": "https://readmanganato.com/manga-cb980036",
                "synopsis": "Leon, a former Japanese worker, was reincarnated into an “otome game” world, and despaired at how it was a world where females hold dominance over males. It was as if men were just livestock that served as stepping stones for females in this world. The only exceptions were the game’s romantic targets, a group of handsome men led by the crown prince.In these bizarre",
                "views": "20,749,396",
                "uploadedDate": "Dec 04,21",
                "authors": "Yomu Mishima, Jun Shiosato",
                "rating": "4.8"
            },
            {...},
            ...
        ]
    }
]
```

#### Example 2:

This query will exclude slice of life and sports genre and filter by a completed manga and the manga title `one piece`.

Example:

```
curl 'http://localhost:3000/manga_list?sts=completed&keyw=one%20piece'
```

Response body:

```json
[
    {
        "info": {
            "keyword": "one piece",
            "filter_status": "completed",
            "included_genres": "",
            "excluded_genres": "",
            "order_by": "",
            "current_page": 1,
            "totalPages": ""
        },
        "data": []
    }
]
```

response is empty because one piece is not completed yet :).

### GET /manga_info

#### Example 1:

"id" parameter and "host-name" header can be found in `GET /manga_list` response body as seen in the above sample.

Example:

```command
curl --header "host-name: readmanganato.com" http://localhost:3000/manga_info?id=manga-cb980036
```

Response body:

```json
[
    {
        "title": "The World Of Otome Games Is Tough For Mobs",
        "img": "https://avt.mkklcdnv6temp.com/13/q/17-1583495755.jpg",
        "alt": "Otome Game Sekai wa Mob ni Kibishii Sekai Desu",
        "authors": [
            {
                "authorName": "Yomu Mishima",
                "authorLink": "https://manganato.com/author/story/eW9tdV9taXNoaW1h"
            },
            {...},
            ...
        ],
        "status": "Ongoing",
        "lastUpdated": "Dec 04,2021 - 07:21 AM",
        "views": "20,764,407",
        "synopsis": "Leon, a former Japanese worker, was reincarnated into an ...",
        "rating": "4.8",
        "totalVotes": "8688",
        "genres": [
            {
                "genre": "Adventure",
                "genreLink": "https://manganato.com/genre-4"
            },
            {
                "genre": "Comedy",
                "genreLink": "https://manganato.com/genre-6"
            },
            {...},
            ...
        ],
        "chapters": [
            {
                "chapterTitle": "Chapter 38",
                "chapterViews": "30,031",
                "uploadedDate": "2 hour ago ",
                "chapterLink": "https://readmanganato.com/manga-cb980036/chapter-38"
            },
            {...},
            ...
        ]
    }
]
```

or you can use the `url` header instead like the below example to achieve the same result.

#### Example 2:

Example:

```command
curl --header "url: https://readmanganato.com/manga-cb980036" http://localhost:3000/manga_info
```

Response body:

```json
[
    {
        "title": "The World Of Otome Games Is Tough For Mobs",
        "img": "https://avt.mkklcdnv6temp.com/13/q/17-1583495755.jpg",
        "alt": "Otome Game Sekai wa Mob ni Kibishii Sekai Desu",
        "authors": [
            {
                "authorName": "Yomu Mishima",
                "authorLink": "https://manganato.com/author/story/eW9tdV9taXNoaW1h"
            },
            {...},
            ...
        ],
        "status": "Ongoing",
        "lastUpdated": "Dec 04,2021 - 07:21 AM",
        ...
        "genres": [
            {
                "genre": "Adventure",
                "genreLink": "https://manganato.com/genre-4"
            },
            {...},
            ...
        ],
        "chapters": [
            {
                "chapterTitle": "Chapter 38",
                "chapterViews": "30,031",
                "uploadedDate": "2 hour ago ",
                "chapterLink": "https://readmanganato.com/manga-cb980036/chapter-38"
            },
            {...},
            ...
        ]
    }
]
```

### GET /read_manga

Finally, as seen in the sample below, you will be able to receive chapter pages as jpg images.

#### Example 1:

`url` header can be seen in the example above.

Example:

```command
curl --header "url: https://readmanganato.com/manga-cb980036/chapter-38" http://localhost:3000/read_manga
```

Response body:

```json
[
    {
        "img": "https://s8.mkklcdnv6temp.com/mangakakalot/v1/vk917567/chapter_38/1.jpg",
        "pageTitle": "The World of Otome Games is Tough for Mobs Chapter 38 page 1"
    },
    {
        "img": "https://s8.mkklcdnv6temp.com/mangakakalot/v1/vk917567/chapter_38/2.jpg",
        "pageTitle": "The World of Otome Games is Tough for Mobs Chapter 38 page 2"
    },
    {
        "img": "https://s8.mkklcdnv6temp.com/mangakakalot/v1/vk917567/chapter_38/3.jpg",
        "pageTitle": "The World of Otome Games is Tough for Mobs Chapter 38 page 3"
    },
    {...},
    ...
]
```

## Contributing

[Pull requests](https://github.com/riimuru/Mangato-api/pulls) are welcome. For major changes, please open an [issue](https://github.com/riimuru/Mangato-api/issues/new) first to discuss what you would like to change.

Please make sure to update tests as appropriate.
