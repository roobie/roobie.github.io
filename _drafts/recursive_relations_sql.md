---
layout: post
title: Querying recursive relations using SQL
date: 2017-06-01 14:58:02 +0100
categories: software rdms sql recursion
tags:
  - sql
---

I recently learned about "Common Table Expressions", a.k.a. CTEs. I had a use-case for a recursive relation in one of my projects, and the first stab at querying the database for the full tree, given a certain node was to use recursion in my application logic, which of course led to a lot of requests going to the database. That's one of those things one might not want to do, so I turned to the internet, and specifically the [Postgres documentation][pgdoc] and [StackOverflow][so-answer] to find a solution.

It looked reasonably easy, but I think many application-level developers, like me, do not know about this, which is why I'm writing this post.

Suppose we have the following schema, for reference:

```sql
CREATE TABLE nodes
(
  id SERIAL, -- just a sequentially auto-generated integer
  parent_id integer, -- the column, which may reference a parent node or not
  CONSTRAINT nodes_pkey PRIMARY KEY (id),
  CONSTRAINT nodes_parent_id_fkey FOREIGN KEY (parent_id)
      REFERENCES nodess (id) MATCH SIMPLE
      ON UPDATE NO ACTION 
      ON DELETE NO ACTION
)
```

The questions are:

1. "Given a node's `id`, how do get the whole sub-tree for that node?"
2. "Given a node's `id`, how do get the whole path in the tree up to the root node for that node?"

The solution to `1` is:

```sql
-- add other columns to select here, e.g. p0."inserted_at", p0."updated_at" 
SELECT p0."id", p0."parent_id" 
FROM "nodes" AS p0 
-- here, we intersect the set from the query and the sub-query, which uses a CTE
WHERE (p0."id" = ANY( 
    -- the (recursive) CTE begins here
    WITH RECURSIVE _tree_ AS (
        -- define the non-recursive term
        SELECT id, parent_id
        FROM pobjects
        WHERE id = $1 -- the parameter defines which node we start at.
      UNION ALL -- UNION or UNION ALL with the recursive term
        SELECT c.id, c.parent_id
        FROM pobjects c
        -- a recursive join, in that we join this query with the non-recursive one
        -- we join the on the recursive `c.parent_id` on the id of the current node
        -- one could read this as "include rows that are children of the current node"
        JOIN _tree_ p ON c.parent_id = p.id
    )
    -- select the id, because it's the one we are after in the above intersection
    SELECT id
    FROM _tree_
  )
)
```

---

[pgdoc]: https://www.postgresql.org/docs/9.6/static/queries-with.html
[so-answer]: https://stackoverflow.com/q/14659856
