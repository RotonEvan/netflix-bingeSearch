# netflix-bingeSearch

## Rest API endpoint details

/top - for top 5 search results

http://localhost:3000/top?q=to

/toprated - for top 5 search results except R, NC, PG rated movies

http://localhost:3000/toprated?q=to

/paginate - for Movies/TV Shows of given page number

http://localhost:3000/paginate?pageno=3&pagesize=10&type=Movie

/exact - for documents with exact match of a given query in a given field

http://localhost:3000/exact?field=director&q=David

/prefix - for documents with prefix match

http://localhost:3000/prefix?value=After

/genre - for documents with matching genres

http://localhost:3000/genre?q=Drama%20and%20Horror