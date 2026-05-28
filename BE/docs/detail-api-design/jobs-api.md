# Job API Design

Base URL: `http://localhost:8000`

Swagger UI: `GET /api-docs`

## Collections

### skills

| Field       | Type     | Required | Notes                |
| ----------- | -------- | -------- | -------------------- |
| `_id`       | ObjectId | Yes      | MongoDB generated id |
| `name`      | String   | Yes      | Unique, trimmed      |
| `createdAt` | Date     | Yes      | Auto generated       |
| `updatedAt` | Date     | Yes      | Auto generated       |

### majors

| Field       | Type     | Required | Notes                |
| ----------- | -------- | -------- | -------------------- |
| `_id`       | ObjectId | Yes      | MongoDB generated id |
| `name`      | String   | Yes      | Unique, trimmed      |
| `createdAt` | Date     | Yes      | Auto generated       |
| `updatedAt` | Date     | Yes      | Auto generated       |

### jobs

| Field                    | Type       | Required | Notes                                          |
| ------------------------ | ---------- | -------- | ---------------------------------------------- |
| `_id`                    | ObjectId   | Yes      | MongoDB generated id                           |
| `companyName`            | String     | Yes      | Trimmed                                        |
| `title`                  | String     | Yes      | Trimmed, used as position filter               |
| `jobType`                | String     | Yes      | `PART_TIME`, `FULL_TIME`                       |
| `description`            | String     | Yes      | Included in full-text search                   |
| `requirements`           | String     | Yes      | Job requirements                               |
| `skills`                 | ObjectId[] | No       | References `skills`                            |
| `majors`                 | ObjectId[] | No       | References `majors`                            |
| `foreignLanguageAbility` | String     | No       | Default empty string                           |
| `location`               | String     | Yes      | Supports partial filter                        |
| `workType`               | String     | Yes      | `OFFLINE`, `REMOTE`, `HYBRID`                  |
| `experience`             | String     | No       | Supports partial filter                        |
| `fresherAccepted`        | Boolean    | No       | Default `false`                                |
| `salary`                 | String     | No       | Default `Thỏa thuận`                           |
| `deadline`               | Date       | Yes      | Application deadline                           |
| `sourceLink`             | String     | No       | Original job source                            |
| `status`                 | String     | No       | `ACTIVE`, `EXPIRED`, `DRAFT`, default `ACTIVE` |
| `tags`                   | String[]   | No       | Trimmed values                                 |
| `createdAt`              | Date       | Yes      | Auto generated                                 |
| `updatedAt`              | Date       | Yes      | Auto generated                                 |

Text index: `{ title: 'text', companyName: 'text', description: 'text' }`.

## Common Pagination

All list endpoints return:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

Query parameters:

| Parameter | Type   | Default | Notes         |
| --------- | ------ | ------- | ------------- |
| `page`    | Number | `1`     | Minimum `1`   |
| `limit`   | Number | `10`    | Maximum `100` |

## GET /api/jobs

Displays paginated jobs and supports filtering.

### Query Parameters

| Parameter                | Type    | Example              | Behavior                                   |
| ------------------------ | ------- | -------------------- | ------------------------------------------ |
| `page`                   | Number  | `1`                  | Current page                               |
| `limit`                  | Number  | `20`                 | Items per page                             |
| `position`               | String  | `backend`            | Partial, case-insensitive match on `title` |
| `skills`                 | String  | `JavaScript,Node.js` | Comma-separated skill names or ids         |
| `majors`                 | String  | `Computer Science`   | Comma-separated major names or ids         |
| `foreignLanguageAbility` | String  | `English`            | Partial, case-insensitive match            |
| `location`               | String  | `Hà Nội`             | Partial, case-insensitive match            |
| `workType`               | String  | `REMOTE`             | Exact enum match                           |
| `experience`             | String  | `1 year`             | Partial, case-insensitive match            |
| `fresherAccepted`        | Boolean | `true`               | Exact boolean match                        |
| `jobType`                | String  | `FULL_TIME`          | Exact enum match                           |
| `status`                 | String  | `ACTIVE`             | Defaults to `ACTIVE` when omitted          |

### Example

`GET /api/jobs?page=1&limit=10&position=backend&skills=Node.js&majors=Computer%20Science&location=H%C3%A0%20N%E1%BB%99i&workType=HYBRID&fresherAccepted=true`

### Success Response

Status: `200 OK`

```json
{
  "data": [
    {
      "_id": "6656c4e8c7446f16dc1c1111",
      "companyName": "Example Co",
      "title": "Backend Intern",
      "jobType": "PART_TIME",
      "skills": [{ "_id": "6656c4e8c7446f16dc1c2222", "name": "Node.js" }],
      "majors": [],
      "location": "Hà Nội",
      "workType": "HYBRID",
      "fresherAccepted": true,
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

## GET /api/jobs/search

Searches jobs using MongoDB full-text search.

### Query Parameters

| Parameter                | Type    | Required | Notes                                                    |
| ------------------------ | ------- | -------- | -------------------------------------------------------- |
| `q`                      | String  | Yes      | Search keyword for `title`, `companyName`, `description` |
| `page`                   | Number  | No       | Current page                                             |
| `limit`                  | Number  | No       | Items per page                                           |
| `position`               | String  | No       | Can be combined with search                              |
| `skills`                 | String  | No       | Comma-separated skill names or ids                       |
| `majors`                 | String  | No       | Comma-separated major names or ids                       |
| `foreignLanguageAbility` | String  | No       | Can be combined with search                              |
| `location`               | String  | No       | Can be combined with search                              |
| `workType`               | String  | No       | Can be combined with search                              |
| `experience`             | String  | No       | Can be combined with search                              |
| `fresherAccepted`        | Boolean | No       | Can be combined with search                              |

### Example

`GET /api/jobs/search?q=backend&page=1&limit=10&location=H%C3%A0%20N%E1%BB%99i`

### Responses

Status: `200 OK` returns the same pagination shape as `GET /api/jobs`.

Status: `400 Bad Request`

```json
{
  "message": "Query parameter q is required"
}
```

## GET /api/jobs/{id}

Displays one job detail by MongoDB ObjectId.

### Path Parameters

| Parameter | Type   | Required | Notes            |
| --------- | ------ | -------- | ---------------- |
| `id`      | String | Yes      | MongoDB ObjectId |

### Example

`GET /api/jobs/6656c4e8c7446f16dc1c1111`

### Success Response

Status: `200 OK`

```json
{
  "data": {
    "_id": "6656c4e8c7446f16dc1c1111",
    "companyName": "Example Co",
    "title": "Backend Intern",
    "jobType": "PART_TIME",
    "description": "Build backend services",
    "requirements": "Node.js basics",
    "skills": [{ "_id": "6656c4e8c7446f16dc1c2222", "name": "Node.js" }],
    "majors": [],
    "foreignLanguageAbility": "English reading",
    "location": "Hà Nội",
    "workType": "HYBRID",
    "experience": "No experience required",
    "fresherAccepted": true,
    "salary": "Thỏa thuận",
    "deadline": "2026-06-30T00:00:00.000Z",
    "sourceLink": "https://example.com/jobs/backend-intern",
    "status": "ACTIVE",
    "tags": ["internship"]
  }
}
```

### Error Responses

Status: `400 Bad Request`

```json
{
  "message": "Invalid job id"
}
```

Status: `404 Not Found`

```json
{
  "message": "Job not found"
}
```
