# Sumo AWS

## Purposes

- Self-training NodeJS, AWS and Serverless framework
- Scrap content about sumo fighters and provide a rest API using
  - Lambdas
  - SNS
  - DynamoDB
  
## Choices made

- AWS
  - NodeJS Lambdas
  - DynamoDB
  - S3
- Serverless framework
- JestJS tests
- Packages
  - cheerio : htmlparser2 is "low level" 
  - dayjs : lighter than momentjs
- Dev Packages
  - dotenv  to load env values from .env files during tests
  - fs to load resources files for tests
  - nock to mock HTTP responses
  - JestJS to test, mock, assert and get test coverage all in ONE   
  
## TODOs

- Scrapping list of sumo fighters : OK
- Scrapping detail : OK
  - Saving to DynamoDB : OK
  Current is missing (have to scrap it from webpage)
- Scrapping picture
  - Generate miniature (optional in first version)
- Rest API to get rikishis 
  - list of all rikishis : OK
  - rikishi detail
  - picture
  - heyas 
- Mobile App to consume REST API

## Lesson learned 

- Tests everything (thanks Javascript)
- JestJS is good
- Doing async is easier than a callbacks of callbacks mess

## Notes

- Serve mock local content using serve
`npm install -g serve`