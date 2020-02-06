
# NoGe
NoGe is a project generator for [Node.js](https://nodejs.org) web frameworks (see [Supported Frameworks](#supported-frameworks)) with **optionally** a **ORM** (see [Supoorted ORMs](#supported-orms))

## Install

With npm:
```bash
npm install -g noge
```
With yarn:
```bash
yarn global add noge
```

## Project structure
```
|-- config
	|-- database.js
	|-- routes.js
|-- src
	|-- controllers 
		|-- .keep
	|-- models
		|-- .keep
	|-- services
		|-- .keep
|-- tests
	|-- controllers
		|-- .keep
	|-- models
		|-- .keep
	|-- services
		|-- .keep
|-- .env
|-- .env.example
|-- .gitignore
|-- index.js
|-- package.json
```
## The .keep file

This file is created because git doesn't track empty folders. 
Feel free to delete these files if you want, but I recommend you to do it only after you push your project or after create some file inside the folders.

## Notes
- Parameters between `<>` are required
- Parameters between `[]` are optional
- `...` means that it accepts more than one value separeted by spaces

## Commands

These are all the available commands

```
Options:

create <name>              create a new project with the given name
scaffold <name>            create a controller, model and route at the same time
controller <names...>      create a controller
model <names...>           create a model
service <names...>         create a service
route <name>               create a route
```

## Commands options
These are all the available options for each command

### # create \<name\>

```
Options:

--no-specs 		   create project without the tests folder
--ignore-setup             ignore the initial setup of the project (name and version)
--ignore-dependencies      ignore the install of the node_modules
--silent 		   do not show any logs while creating
```

### # scaffold \<name\>

```
Options:

--empty-controller                        generate a controller without default actions. This overrides the --actions-controller
--empty-service                           generate an action without default actions. This overrides the --actions-service
--actions-controller		          specify wich actions to generate: Available values are: index, show, create, update and destroy
--actions-service                         specify wich actions to generate: Available values are: get, getOne, insert, update, destroy
--no-spec			          do not generate spec file for the generated model and controller
--table                   	          the corresponding table name of the model
--belongs-to <relation_expression>        generate a belongs to relation with the specified model
--has-many <relation_expression>          generate a has many relation with the specified model
--many-to-many <relation_expression>      generate a many to many relation with the specified model
```

For the relation syntax see [relation expression](#relation-expression)  
  
#### # Note about scaffold


When scaffolding more than one at once, these options will be ignore:  
* `--table`
* `--belongs-to`
* `--has-many`
* `--many-to-many`


### # controller \<names...\>

```
Options:

--actions <actions>      specify wich actions to generate: Available values are: index, show, create, update and destroy
--no-spec                do not generate spec file for the generated controller
--empty                  generate a controller without default actions. This overrides the actions option
```

Examples:

```
noge controller user
noge controller user --empty
noge controller user --actions index,show,destroy
```

### # model \<names...\>

```
Options:

--no-spec                                 do not generate spec file for the generated model
-t, --table                               the corresponding table name of the model
--belongs-to <relation_expression>        generate a belongs to relation with the specified model
--has-many <relation_expression>          generate a has many relation with the specified model
--many-to-many <relation_expression>      generate a many to many relation with the specified model
```

For the relation syntax see [relation expression](#relation-expression)

### # service \<names...\>

```
Options:

--actions <actions>      specify wich actions to generate: Available values are: get, getOne, insert, update, destroy
--empty                  generate a service without default actions. This overrides the --actions
--project-path           the path for project dir if it is different from the current dir
```

Examples:

```
noge service user
noge service user --empty
noge service user --actions get,getOne,insert
noge service user --project-path projects/my-projetc
```

#### # Service options values
| Option | Values | Notes |
| -- | -- | -- |
| --actions | get,getOne,insert,update,delete | At least one is necessary if this option is present |

### # route \<names...\>

<p><span style="color: red">Not available yet</span></p>

Examples:

```bash
noge route user
```

## Relation expression

The syntax for relations are:  

* For `has-many` and `belongs-to`:  
`relation_model`:`relation_model_column`:`parent_column`

* For `many-to-many`:  
`relation_model`:`relation_model_column`:`middle_table`: `middle_table_column_relation`:`middle_table_column_parent`:`parent_column`  

| Keyword | Description |
| -- | -- |
| `relation_model` | The referenced model |
| `relation_model_column` | The referenced model column |
| `middle_table` | The middle table. The table that contains the many to many relation |
| `middle_table_column_relation` | The middle table column that references the `relation_model_column` |
| `middle_table_column_parent` | The middle table column that references the `parent_column` |
| `parent_column` | The parent column beein referenced |

Examples:

```bash
noge model animal --belongs-to person:id:personId
noge model person --has-many animal:personId:id
noge model person --many-to-many movie:id:person_movies:movieId:personId:id
```

## Supported frameworks

- [Express](https://github.com/expressjs/express)

## Supported ORMs

 - [Objection.js](https://vincit.github.io/objection.js/)
 
## Testing

For testing just go to the root or to `tests` folder and run:

```bash
yarn test
```
or
```bash
npm test
```



## Contributing
