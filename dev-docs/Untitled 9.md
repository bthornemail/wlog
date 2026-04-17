**Logic programming** is a [programming](https://en.wikipedia.org/wiki/Programming_paradigm "Programming paradigm"), [database](https://en.wikipedia.org/wiki/Database "Database") and [knowledge representation](https://en.wikipedia.org/wiki/Knowledge_representation "Knowledge representation") paradigm based on formal [logic](https://en.wikipedia.org/wiki/Logic "Logic"). A logic program is a set of sentences in logical form, representing knowledge about some problem domain. Computation is performed by applying logical reasoning to that knowledge, to solve problems in the domain. Major logic programming language families include [Prolog](https://en.wikipedia.org/wiki/Prolog "Prolog"), [Answer Set Programming](https://en.wikipedia.org/wiki/Answer_set_programming "Answer set programming") (ASP) and [Datalog](https://en.wikipedia.org/wiki/Datalog "Datalog"). In all of these languages, rules are written in the form of _[clauses](https://en.wikipedia.org/wiki/Clause_\(logic\) "Clause (logic)")_:

`A :- B1, ..., Bn.`

and are read as declarative sentences in logical form:

`A if B1 and ... and Bn.`

`A` is called the _head_ of the rule, `B1`, ..., `Bn` is called the _body_, and the `Bi` are called _[literals](https://en.wikipedia.org/wiki/Literal_\(mathematical_logic\) "Literal (mathematical logic)")_ or conditions. When n = 0, the rule is called a _fact_ and is written in the simplified form:

`A.`

Queries (or goals) have the same syntax as the bodies of rules and are commonly written in the form:

`?- B1, ..., Bn.`

In the simplest case of [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause "Horn clause") (or "definite" clauses), all of the A, B1, ..., Bn are [atomic formulae](https://en.wikipedia.org/wiki/Atomic_formula "Atomic formula") of the form p(t1 ,..., tm), where p is a predicate symbol naming a relation, like "motherhood", and the ti are terms naming objects (or individuals). Terms include both constant symbols, like "charles", and variables, such as X, which start with an upper case letter.

Consider, for example, the following Horn clause program:

mother_child(elizabeth, charles).
father_child(charles, william).
father_child(charles, harry).
parent_child(X, Y) :- 
     mother_child(X, Y).
parent_child(X, Y) :- 
     father_child(X, Y).
grandparent_child(X, Y) :- 
     parent_child(X, Z), 
     parent_child(Z, Y).

Given a query, the program produces answers. For instance for a query `?- parent_child(X, william)`, the single answer is

X = charles

Various queries can be asked. For instance the program can be queried both to generate grandparents and to generate grandchildren. It can even be used to generate all pairs of grandchildren and grandparents, or simply to check if a given pair is such a pair:

grandparent_child(X, william).
X = elizabeth

?- grandparent_child(elizabeth, Y).
Y = william;
Y = harry.

?- grandparent_child(X, Y).
X = elizabeth
Y = william;
X = elizabeth
Y = harry.

?- grandparent_child(william, harry).
no
?- grandparent_child(elizabeth, harry).
yes

Although Horn clause logic programs are [Turing complete](https://en.wikipedia.org/wiki/Turing_completeness "Turing completeness"),[[1]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-1)[[2]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-2) for most practical applications, Horn clause programs need to be extended to "normal" logic programs with negative conditions. For example, the definition of sibling uses a negative condition, where the [predicate](https://en.wikipedia.org/wiki/Predicate_\(mathematical_logic\) "Predicate (mathematical logic)") = is defined by the clause `X = X` :

sibling(X, Y) :- 
     parent_child(Z, X), 
     parent_child(Z, Y), 
     not(X = Y).

Logic programming languages that include negative conditions have the knowledge representation capabilities of a [non-monotonic logic](https://en.wikipedia.org/wiki/Non-monotonic_logic "Non-monotonic logic").

In ASP and Datalog, logic programs have only a [declarative](https://en.wikipedia.org/wiki/Declarative_programming "Declarative programming") reading, and their execution is performed by means of a proof procedure or model generator whose behaviour is not meant to be controlled by the programmer. However, in the Prolog family of languages, logic programs also have a [procedural](https://en.wikipedia.org/wiki/Procedural_programming "Procedural programming") interpretation as goal-reduction procedures. From this point of view, clause A :- B1,...,Bn is understood as:

to solve `A`, solve `B1`, and ... and solve `Bn`.

Negative conditions in the bodies of clauses also have a procedural interpretation, known as _[negation as failure](https://en.wikipedia.org/wiki/Negation_as_failure "Negation as failure")_: A negative literal `not B` is deemed to hold if and only if the positive literal `B` fails to hold.

Much of the research in the field of logic programming has been concerned with trying to develop a logical semantics for negation as failure and with developing other semantics and other implementations for negation. These developments have been important, in turn, for supporting the development of [formal methods](https://en.wikipedia.org/wiki/Formal_methods "Formal methods") for logic-based [program verification](https://en.wikipedia.org/wiki/Formal_verification "Formal verification") and [program transformation](https://en.wikipedia.org/wiki/Program_transformation "Program transformation").

## History

The use of mathematical logic to represent and execute [computer programs](https://en.wikipedia.org/wiki/Computer_program "Computer program") is also a feature of the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus "Lambda calculus"), developed by [Alonzo Church](https://en.wikipedia.org/wiki/Alonzo_Church "Alonzo Church") in the 1930s. However, the first proposal to use the [clausal](https://en.wikipedia.org/wiki/Clausal_normal_form "Clausal normal form") form of logic for representing computer programs was made by [Cordell Green](https://en.wikipedia.org/wiki/Cordell_Green "Cordell Green").[[3]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-3) This used an axiomatization of a subset of [LISP](https://en.wikipedia.org/wiki/LISP "LISP"), together with a representation of an input-output relation, to compute the relation by simulating the execution of the program in LISP. Foster and Elcock's [Absys](https://en.wikipedia.org/wiki/Absys "Absys"), on the other hand, employed a combination of equations and lambda calculus in an assertional programming language that places no constraints on the order in which operations are performed.[[4]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-4)

Logic programming, with its current syntax of facts and rules, can be traced back to debates in the late 1960s and early 1970s about declarative versus procedural representations of knowledge in [artificial intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence "Artificial intelligence"). Advocates of declarative representations were notably working at [Stanford](https://en.wikipedia.org/wiki/Stanford_University "Stanford University"), associated with [John McCarthy](https://en.wikipedia.org/wiki/John_McCarthy_\(computer_scientist\) "John McCarthy (computer scientist)"), [Bertram Raphael](https://en.wikipedia.org/wiki/Bertram_Raphael "Bertram Raphael") and Cordell Green, and in [Edinburgh](https://en.wikipedia.org/wiki/University_of_Edinburgh "University of Edinburgh"), with [John Alan Robinson](https://en.wikipedia.org/wiki/John_Alan_Robinson "John Alan Robinson") (an academic visitor from [Syracuse University](https://en.wikipedia.org/wiki/Syracuse_University "Syracuse University")), [Pat Hayes](https://en.wikipedia.org/wiki/Patrick_J._Hayes "Patrick J. Hayes"), and [Robert Kowalski](https://en.wikipedia.org/wiki/Robert_Kowalski "Robert Kowalski"). Advocates of procedural representations were mainly centered at [MIT](https://en.wikipedia.org/wiki/MIT "MIT"), under the leadership of [Marvin Minsky](https://en.wikipedia.org/wiki/Marvin_Minsky "Marvin Minsky") and [Seymour Papert](https://en.wikipedia.org/wiki/Seymour_Papert "Seymour Papert").[[5]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-5)

Although it was based on the proof methods of logic, [Planner](https://en.wikipedia.org/wiki/Planner_\(programming_language\) "Planner (programming language)"), developed by [Carl Hewitt](https://en.wikipedia.org/wiki/Carl_Hewitt "Carl Hewitt") at MIT, was the first language to emerge within this proceduralist paradigm.[[6]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-6) Planner featured pattern-directed invocation of procedural plans from goals (i.e. goal-reduction or [backward chaining](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining")) and from assertions (i.e. [forward chaining](https://en.wikipedia.org/wiki/Forward_chaining "Forward chaining")). The most influential implementation of Planner was the subset of Planner, called Micro-Planner, implemented by [Gerry Sussman](https://en.wikipedia.org/wiki/Gerald_Jay_Sussman "Gerald Jay Sussman"), [Eugene Charniak](https://en.wikipedia.org/wiki/Eugene_Charniak "Eugene Charniak") and [Terry Winograd](https://en.wikipedia.org/wiki/Terry_Winograd "Terry Winograd"). Winograd used Micro-Planner to implement the landmark, natural-language understanding program [SHRDLU](https://en.wikipedia.org/wiki/SHRDLU "SHRDLU").[[7]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Winograd-7) For the sake of efficiency, Planner used a backtracking control structure so that only one possible computation path had to be stored at a time. Planner gave rise to the programming languages [QA4](https://en.wikipedia.org/wiki/Richard_Waldinger#QA4 "Richard Waldinger"),[[8]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Rulifson-8) Popler,[[9]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-9) Conniver,[[10]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-10) QLISP,[[11]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-11) and the concurrent language Ether.[[12]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-12)

Hayes and Kowalski in Edinburgh tried to reconcile the logic-based declarative approach to knowledge representation with Planner's procedural approach. Hayes (1973) developed an equational language, Golux, in which different procedures could be obtained by altering the behavior of the theorem prover.[[13]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-13)

In the meanwhile, [Alain Colmerauer](https://en.wikipedia.org/wiki/Alain_Colmerauer "Alain Colmerauer") in [Marseille](https://en.wikipedia.org/wiki/Marseille "Marseille") was working on [natural-language understanding](https://en.wikipedia.org/wiki/Natural-language_understanding "Natural-language understanding"), using logic to represent semantics and using resolution for question-answering. During the summer of 1971, Colmerauer invited Kowalski to Marseille, and together they discovered that the clausal form of logic could be used to represent [formal grammars](https://en.wikipedia.org/wiki/Formal_grammars "Formal grammars") and that resolution theorem provers could be used for parsing. They observed that some theorem provers, like hyper-resolution,[[14]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-14) behave as bottom-up parsers and others, like [SL resolution](https://en.wikipedia.org/wiki/SLD_resolution "SLD resolution") (1971)[[15]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-15) behave as top-down parsers.

It was in the following summer of 1972, that Kowalski, again working with Colmerauer, developed the procedural interpretation of implications in clausal form. It also became clear that such clauses could be restricted to definite clauses or [Horn clauses](https://en.wikipedia.org/wiki/Horn_clause "Horn clause"), and that SL-resolution could be restricted (and generalised) to [SLD resolution](https://en.wikipedia.org/wiki/SLD_resolution "SLD resolution"). Kowalski's procedural interpretation and SLD were described in a 1973 memo, published in 1974.[[16]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Kowalski-16)

Colmerauer, with Philippe Roussel, used the procedural interpretation as the basis of Prolog, which was implemented in the summer and autumn of 1972. The first Prolog program, also written in 1972 and implemented in Marseille, was a French question-answering system. The use of Prolog as a practical programming language was given great momentum by the development of a compiler by [David H. D. Warren](https://en.wikipedia.org/wiki/David_H._D._Warren "David H. D. Warren") in Edinburgh in 1977. Experiments demonstrated that Edinburgh Prolog could compete with the processing speed of other [symbolic programming](https://en.wikipedia.org/wiki/Symbolic_programming "Symbolic programming") languages such as [Lisp](https://en.wikipedia.org/wiki/Lisp_\(programming_language\) "Lisp (programming language)").[[17]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-17) Edinburgh Prolog became the _de facto_ standard and strongly influenced the definition of [ISO](https://en.wikipedia.org/wiki/International_Organization_for_Standardization "International Organization for Standardization") standard Prolog.

Logic programming gained international attention during the 1980s, when it was chosen by the Japanese [Ministry of International Trade and Industry](https://en.wikipedia.org/wiki/Ministry_of_International_Trade_and_Industry "Ministry of International Trade and Industry") to develop the software for the [Fifth Generation Computer Systems](https://en.wikipedia.org/wiki/Fifth_Generation_Computer_Systems "Fifth Generation Computer Systems") (FGCS) project. The FGCS project aimed to use logic programming to develop advanced [Artificial Intelligence](https://en.wikipedia.org/wiki/Artificial_Intelligence "Artificial Intelligence") applications on massively [parallel computers](https://en.wikipedia.org/wiki/Parallel_computing "Parallel computing"). Although the project initially explored the use of Prolog, it later adopted the use of [concurrent logic programming](https://en.wikipedia.org/wiki/Concurrent_logic_programming "Concurrent logic programming"), because it was closer to the FGCS computer architecture.

However, the committed choice feature of concurrent logic programming interfered with the language's logical semantics[[18]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-18) and with its suitability for knowledge representation and problem solving applications. Moreover, the parallel computer systems developed in the project failed to compete with advances taking place in the development of more conventional, general-purpose computers. Together these two issues resulted in the FGCS project failing to meet its objectives. Interest in both logic programming and AI fell into world-wide decline.[[19]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-19)

In the meanwhile, more declarative logic programming approaches, including those based on the use of Prolog, continued to make progress independently of the FGCS project. In particular, although Prolog was developed to combine declarative and procedural representations of knowledge, the purely declarative interpretation of logic programs became the focus for applications in the field of [deductive databases](https://en.wikipedia.org/wiki/Deductive_database "Deductive database"). Work in this field became prominent around 1977, when Hervé Gallaire and [Jack Minker](https://en.wikipedia.org/wiki/Jack_Minker "Jack Minker") organized a workshop on logic and databases in Toulouse.[[20]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-20) The field was eventually renamed as _[Datalog](https://en.wikipedia.org/wiki/Datalog "Datalog")_.

This focus on the logical, declarative reading of logic programs was given further impetus by the development of [constraint logic programming](https://en.wikipedia.org/wiki/Constraint_logic_programming "Constraint logic programming") in the 1980s and [Answer Set Programming](https://en.wikipedia.org/wiki/Answer_set_programming "Answer set programming") in the 1990s. It is also receiving renewed emphasis in recent applications of Prolog[[21]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Prolog_Book-21)

The [Association for Logic Programming](https://en.wikipedia.org/wiki/Association_for_Logic_Programming "Association for Logic Programming") (ALP) was founded in 1986 to promote Logic Programming. Its official journal until 2000, was _[The Journal of Logic Programming](https://en.wikipedia.org/wiki/The_Journal_of_Logic_Programming "The Journal of Logic Programming")_. Its founding [editor-in-chief](https://en.wikipedia.org/wiki/Editor-in-chief "Editor-in-chief") was [J. Alan Robinson](https://en.wikipedia.org/wiki/J._Alan_Robinson "J. Alan Robinson").[[22]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-22) In 2001, the journal was renamed _The Journal of Logic and Algebraic Programming_, and the official journal of ALP became _[Theory and Practice of Logic Programming](https://en.wikipedia.org/wiki/Theory_and_Practice_of_Logic_Programming "Theory and Practice of Logic Programming")_, published by [Cambridge University Press](https://en.wikipedia.org/wiki/Cambridge_University_Press "Cambridge University Press").

## Concepts

Logic programs enjoy a rich variety of semantics and problem solving methods, as well as a wide range of applications in programming, databases, knowledge representation and problem solving.

### Algorithm = Logic + Control

The procedural interpretation of logic programs, which uses backward reasoning to reduce goals to subgoals, is a special case of the use of a problem-solving strategy to **control** the use of a declarative, **logical** representation of knowledge to obtain the behaviour of an **algorithm**. More generally, different problem-solving strategies can be applied to the same logical representation to obtain different algorithms. Alternatively, different algorithms can be obtained with a given problem-solving strategy by using different logical representations.[[23]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-23)

The two main problem-solving strategies are [backward reasoning](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining") (goal reduction) and [forward reasoning](https://en.wikipedia.org/wiki/Forward_chaining "Forward chaining"), also known as top-down and bottom-up reasoning, respectively.

In the simple case of a propositional Horn clause program and a top-level atomic goal, backward reasoning determines an [and-or tree](https://en.wikipedia.org/wiki/And-or_tree "And-or tree"), which constitutes the search space for solving the goal. The top-level goal is the root of the tree. Given any node in the tree and any clause whose head matches the node, there exists a set of child nodes corresponding to the sub-goals in the body of the clause. These child nodes are grouped together by an "and". The alternative sets of children corresponding to alternative ways of solving the node are grouped together by an "or".

Any search strategy can be used to search this space. Prolog uses a sequential, last-in-first-out, backtracking strategy, in which only one alternative and one sub-goal are considered at a time. For example, subgoals can be solved in parallel, and clauses can also be tried in parallel. The first strategy is called **and-parallel** and the second strategy is called **or-parallel**. Other search strategies, such as intelligent backtracking,[[24]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-24) or best-first search to find an optimal solution,[[25]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-25) are also possible.

In the more general, non-propositional case, where sub-goals can share variables, other strategies can be used, such as choosing the subgoal that is most highly instantiated or that is sufficiently instantiated so that only one procedure applies.[[26]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-26) Such strategies are used, for example, in [concurrent logic programming](https://en.wikipedia.org/wiki/Concurrent_logic_programming "Concurrent logic programming").

In most cases, backward reasoning from a query or goal is more efficient than forward reasoning. But sometimes with Datalog and Answer Set Programming, there may be no query that is separate from the set of clauses as a whole, and then generating all the facts that can be derived from the clauses is a sensible problem-solving strategy. Here is another example, where forward reasoning beats backward reasoning in a more conventional computation task, where the goal `?- fibonacci(n, Result)` is to find the nth fibonacci number:

fibonacci(0, 0).
fibonacci(1, 1).

fibonacci(N, Result) :-
    N > 1,
    N1 is N - 1,
    N2 is N - 2,
    fibonacci(N1, F1),
    fibonacci(N2, F2),
    Result is F1 + F2.

Here the relation `fibonacci(N, M)` stands for the function `fibonacci(N) = M`, and the predicate `N is Expression` is Prolog notation for the predicate that instantiates the variable `N` to the value of `Expression`.

Given the goal of computing the fibonacci number of `n`, backward reasoning reduces the goal to the two subgoals of computing the fibonacci numbers of n-1 and n-2. It reduces the subgoal of computing the fibonacci number of n-1 to the two subgoals of computing the fibonacci numbers of n-2 and n-3, redundantly computing the fibonacci number of n-2. This process of reducing one fibonacci subgoal to two fibonacci subgoals continues until it reaches the numbers 0 and 1. Its complexity is of the order 2n. In contrast, forward reasoning generates the sequence of fibonacci numbers, starting from 0 and 1 without any recomputation, and its complexity is linear with respect to n.

Prolog cannot perform forward reasoning directly. But it can achieve the effect of forward reasoning within the context of backward reasoning by means of [tabling](https://en.wikipedia.org/wiki/Tabling "Tabling"): Subgoals are maintained in a table, along with their solutions. If a subgoal is re-encountered, it is solved directly by using the solutions already in the table, instead of re-solving the subgoals redundantly.[[27]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-27)

### Relationship with functional programming

See also: [Functional programming § Comparison to logic programming](https://en.wikipedia.org/wiki/Functional_programming#Comparison_to_logic_programming "Functional programming")

Logic programming can be viewed as a generalisation of functional programming, in which functions are a special case of relations.[[28]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-dis-28) For example, the function, mother(X) = Y, (every X has only one mother Y) can be represented by the relation mother(X, Y). In this respect, logic programs are similar to [relational databases](https://en.wikipedia.org/wiki/Relational_databases "Relational databases"), which also represent functions as relations.

Compared with relational syntax, functional syntax is more compact for nested functions. For example, in functional syntax the definition of maternal grandmother can be written in the nested form:

maternal_grandmother(X) = mother(mother(X)).

The same definition in relational notation needs to be written in the unnested, flattened form:

maternal_grandmother(X, Y) :- mother(X, Z), mother(Z, Y).

However, nested syntax can be regarded as syntactic sugar for unnested syntax. [Ciao](https://en.wikipedia.org/wiki/Ciao_\(programming_language\) "Ciao (programming language)") Prolog, for example, transforms functional syntax into relational form and executes the resulting logic program using the standard Prolog execution strategy.[[29]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-29) Moreover, the same transformation can be used to execute nested relations that are not functional. For example:

grandparent(X) := parent(parent(X)).
parent(X) := mother(X).
parent(X) := father(X).

mother(charles) := elizabeth.
father(charles) := phillip.
mother(harry) := diana.
father(harry) := charles.

?- grandparent(X,Y).
X = harry,
Y = elizabeth.
X = harry,
Y = phillip.

### Relationship with relational programming

The term _relational programming_ has been used to cover a variety of programming languages that treat functions as a special case of relations. Some of these languages, such as [miniKanren](https://en.wikipedia.org/wiki/MiniKanren "MiniKanren")[[28]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-dis-28) and relational linear programming[[30]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-30) are logic programming languages in the sense of this article.

However, the relational language RML is an imperative programming language [[31]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-31) whose core construct is a relational expression, which is similar to an expression in first-order predicate logic.

Other relational programming languages are based on the relational calculus[[32]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-32) or relational algebra.[[33]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-33)

### Semantics of Horn clause programs

Main article: [Syntax and semantics of logic programming](https://en.wikipedia.org/wiki/Syntax_and_semantics_of_logic_programming "Syntax and semantics of logic programming")

Viewed in purely logical terms, there are two approaches to the declarative semantics of Horn clause logic programs: One approach is the original _[logical consequence](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence") semantics_, which understands solving a goal as showing that the goal is a theorem that is true in all [models](https://en.wikipedia.org/wiki/Structure_\(mathematical_logic\)#Structures_and_first-order_logic "Structure (mathematical logic)") of the program.

In this approach, computation is [theorem-proving](https://en.wikipedia.org/wiki/Automated_theorem_proving "Automated theorem proving") in [first-order logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic"); and both [backward reasoning](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining"), as in SLD resolution, and [forward reasoning](https://en.wikipedia.org/wiki/Forward_chaining "Forward chaining"), as in hyper-resolution, are correct and complete theorem-proving methods. Sometimes such theorem-proving methods are also regarded as providing a separate [proof-theoretic (or operational) semantics](https://en.wikipedia.org/wiki/Proof-theoretic_semantics "Proof-theoretic semantics") for logic programs. But from a logical point of view, they are proof methods, rather than semantics.

The other approach to the declarative semantics of Horn clause programs is the _[satisfiability](https://en.wikipedia.org/wiki/Satisfiability "Satisfiability") semantics_, which understands solving a goal as showing that the goal is true (or satisfied) in some [intended (or standard) model](https://en.wikipedia.org/wiki/Intended_interpretation "Intended interpretation") of the program. For Horn clause programs, there always exists such a standard model: It is the unique _minimal model_ of the program.

Informally speaking, a minimal model is a model that, when it is viewed as the set of all (variable-free) facts that are true in the model, contains no smaller set of facts that is also a model of the program.

For example, the following facts represent the minimal model of the family relationships example in the introduction of this article. All other variable-free facts are false in the model:

mother_child(elizabeth, charles).
father_child(charles, william).
father_child(charles, harry).
parent_child(elizabeth, charles).
parent_child(charles, william).
parent_child(charles, harry).
grandparent_child(elizabeth, william).
grandparent_child(elizabeth, harry).

The satisfiability semantics also has an alternative, more mathematical characterisation as the [least fixed point](https://en.wikipedia.org/wiki/Least_fixed_point "Least fixed point") of the function that uses the rules in the program to derive new facts from existing facts in one step of inference.

Remarkably, the same problem-solving methods of forward and backward reasoning, which were originally developed for the logical consequence semantics, are equally applicable to the satisfiability semantics: Forward reasoning generates the minimal model of a Horn clause program, by deriving new facts from existing facts, until no new additional facts can be generated. Backward reasoning, which succeeds by reducing a goal to subgoals, until all subgoals are solved by facts, ensures that the goal is true in the minimal model, without generating the model explicitly.[[34]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-34)

The difference between the two declarative semantics can be seen with the definitions of addition and multiplication in [successor arithmetic](https://en.wikipedia.org/wiki/Peano_arithmetic#Defining_arithmetic_operations_and_relations "Peano arithmetic"), which represents the natural numbers `0, 1, 2, ...` as a sequence of terms of the form `0, s(0), s(s(0)), ...`. In general, the term `s(X)` represents the successor of `X,` namely `X + 1.` Here are the standard definitions of addition and multiplication in functional notation:

     X + 0 = X.
     X + s(Y)    = s(X + Y). 
i.e. X + (Y + 1) = (X + Y) + 1

     X × 0 = 0.
     X × s(Y)    = X + (X × Y). 
i.e. X × (Y + 1) = X + (X × Y).

Here are the same definitions as a logic program, using `add(X, Y, Z)` to represent `X + Y = Z,` and `multiply(X, Y, Z)` to represent `X × Y = Z`:

add(X, 0, X).
add(X, s(Y), s(Z)) :- add(X, Y, Z).

multiply(X, 0, 0).
multiply(X, s(Y), W) :- multiply(X, Y, Z), add(X, Z, W).

The two declarative semantics both give the same answers for the same existentially quantified conjunctions of addition and multiplication goals. For example `2 × 2 = X` has the solution `X = 4`; and `X × X = X + X` has two solutions `X = 0` and `X = 2`:

?- multiply(s(s(0)), s(s(0)), X).
X = s(s(s(s(0)))).

?- multiply(X, X, Y), add(X, X, Y).
X = 0, Y = 0.
X = s(s(0)), Y = s(s(s(s(0)))).

However, with the logical-consequence semantics, there are non-standard models of the program, in which, for example, `add(s(s(0)), s(s(0)), s(s(s(s(s(0)))))),` i.e. `2 + 2 = 5` is true. But with the satisfiability semantics, there is only one model, namely the standard model of arithmetic, in which `2 + 2 = 5` is false.

In both semantics, the goal `?- add(s(s(0)), s(s(0)), s(s(s(s(s(0))))))` fails. In the satisfiability semantics, the failure of the goal means that the truth value of the goal is false. But in the logical consequence semantics, the failure means that the truth value of the goal is unknown.

### Negation as failure

Main article: [Negation as failure](https://en.wikipedia.org/wiki/Negation_as_failure "Negation as failure")

[Negation as failure](https://en.wikipedia.org/wiki/Negation_as_failure "Negation as failure") (NAF), as a way of concluding that a negative condition `not p` holds by showing that the positive condition `p` fails to hold, was already a feature of early Prolog systems. The resulting extension of [SLD resolution](https://en.wikipedia.org/wiki/SLD_resolution "SLD resolution") is called [SLDNF](https://en.wikipedia.org/wiki/SLD_resolution#SLDNF "SLD resolution"). A similar construct, called "thnot", also existed in [Micro-Planner](https://en.wikipedia.org/wiki/Micro-Planner_\(programming_language\) "Micro-Planner (programming language)").

The logical semantics of NAF was unresolved until [Keith Clark](https://en.wikipedia.org/wiki/Keith_Clark_\(computer_scientist\) "Keith Clark (computer scientist)")[[35]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-35) showed that, under certain natural conditions, NAF is an efficient, correct (and sometimes complete) way of reasoning with the logical consequence semantics using the [_completion_](https://en.wikipedia.org/wiki/Negation_as_failure#Completion_semantics "Negation as failure") of a logic program in first-order logic.

Completion amounts roughly to regarding the set of all the program clauses with the same predicate in the head, say:

`A :- Body1.`

`...`

`A :- Bodyk.`

as a definition of the predicate:

`A iff (Body1 or ... or Bodyk)`

where `iff` means "if and only if". The completion also includes axioms of equality, which correspond to [unification](https://en.wikipedia.org/wiki/Unification_\(computer_science\) "Unification (computer science)"). Clark showed that proofs generated by SLDNF are structurally similar to proofs generated by a natural deduction style of reasoning with the completion of the program.

Consider, for example, the following program:

should_receive_sanction(X, punishment) :- 
    is_a_thief(X),
    not should_receive_sanction(X, rehabilitation).
    
should_receive_sanction(X, rehabilitation) :-
    is_a_thief(X),
    is_a_minor(X),
    not is_violent(X).
    
is_a_thief(tom).

Given the goal of determining whether tom should receive a sanction, the first rule succeeds in showing that tom should be punished:

?- should_receive_sanction(tom, Sanction).
Sanction = punishment.

This is because tom is a thief, and it cannot be shown that tom should be rehabilitated. It cannot be shown that tom should be rehabilitated, because it cannot be shown that tom is a minor.

If, however, we receive new information that tom is indeed a minor, the previous conclusion that tom should be punished is replaced by the new conclusion that tom should be rehabilitated:

is_a_minor(tom).

?- should_receive_sanction(tom, Sanction).
Sanction = rehabilitation.

This property of withdrawing a conclusion when new information is added, is called non-monotonicity, and it makes logic programming a [non-monotonic logic](https://en.wikipedia.org/wiki/Non-monotonic_logic "Non-monotonic logic").

But, if we are now told that tom is violent, the conclusion that tom should be punished will be reinstated:

is_violent(tom).

?- should_receive_sanction(tom, Sanction).
Sanction = punishment.

The completion of this program is:

should_receive_sanction(X, Sanction) iff 
    Sanction = punishment, is_a_thief(X), 
    not should_receive_sanction(X, rehabilitation)
 or Sanction = rehabilitation, is_a_thief(X), is_a_minor(X),
    not is_violent(X).
    
is_a_thief(X) iff X = tom.
is_a_minor(X) iff X = tom.
is_violent(X) iff X = tom.

The notion of completion is closely related to [John McCarthy's](https://en.wikipedia.org/wiki/John_McCarthy_\(computer_scientist\) "John McCarthy (computer scientist)") [circumscription](https://en.wikipedia.org/wiki/Circumscription_\(logic\) "Circumscription (logic)") semantics for default reasoning,[[36]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-36) and to [Ray Reiter's](https://en.wikipedia.org/wiki/Raymond_Reiter "Raymond Reiter") [closed world assumption](https://en.wikipedia.org/wiki/Closed_world_assumption "Closed world assumption").[[37]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-37)

The completion semantics for negation is a logical consequence semantics, for which SLDNF provides a proof-theoretic implementation. However, in the 1980s, the satisfiability semantics became more popular for logic programs with negation. In the satisfiability semantics, negation is interpreted according to the classical definition of truth in an intended or standard model of the logic program.

In the case of logic programs with negative conditions, there are two main variants of the satisfiability semantics: In the [well-founded semantics](https://en.wikipedia.org/wiki/Well-founded_semantics "Well-founded semantics"), the intended model of a logic program is a unique, three-valued, minimal model, which always exists. The well-founded semantics generalises the notion of [inductive definition](https://en.wikipedia.org/wiki/Inductive_definition "Inductive definition") in mathematical logic.[[38]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-38) [XSB Prolog](https://en.wikipedia.org/wiki/XSB "XSB")[[39]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-39) implements the well-founded semantics using SLG resolution.[[40]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-40)

In the alternative [stable model semantics](https://en.wikipedia.org/wiki/Stable_model_semantics "Stable model semantics"), there may be no intended models or several intended models, all of which are minimal and two-valued. The stable model semantics underpins [answer set programming](https://en.wikipedia.org/wiki/Answer_set_programming "Answer set programming") (ASP).

Both the well-founded and stable model semantics apply to arbitrary logic programs with negation. However, both semantics coincide for [stratified](https://en.wikipedia.org/wiki/Syntax_and_semantics_of_logic_programming#Stratified_negation "Syntax and semantics of logic programming") logic programs. For example, the program for sanctioning thieves is (locally) stratified, and all three semantics for the program determine the same intended model:

should_receive_sanction(tom, punishment).
is_a_thief(tom).
is_a_minor(tom).
is_violent(tom).

Attempts to understand negation in logic programming have also contributed to the development of [abstract argumentation frameworks](https://en.wikipedia.org/wiki/Argumentation_framework "Argumentation framework").[[41]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-41) In an argumentation interpretation of negation, the initial argument that tom should be punished because he is a thief, is attacked by the argument that he should be rehabilitated because he is a minor. But the fact that tom is violent undermines the argument that tom should be rehabilitated and reinstates the argument that tom should be punished.

### Metalogic programming

[Metaprogramming](https://en.wikipedia.org/wiki/Metaprogramming "Metaprogramming"), in which programs are treated as data, was already a feature of early Prolog implementations.[[42]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-42)[[43]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Warren-43) For example, the Edinburgh DEC10 implementation of Prolog included "an interpreter and a compiler, both written in Prolog itself".[[43]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Warren-43) The simplest metaprogram is the so-called "[vanilla](https://en.wikipedia.org/wiki/Vanilla_\(computing\) "Vanilla (computing)")" meta-interpreter:

    solve(true).
    solve((B,C)):- solve(B),solve(C).
    solve(A):- clause(A,B),solve(B).

where true represents an empty conjunction, and (B,C) is a composite term representing the conjunction of B and C. The predicate clause(A,B) means that there is a clause of the form A :- B.

Metaprogramming is an application of the more general use of a _[metalogic](https://en.wikipedia.org/wiki/Metalogic "Metalogic")_ or _[metalanguage](https://en.wikipedia.org/wiki/Metalanguage "Metalanguage")_ to describe and reason about another language, called the _object language_.

Metalogic programming allows object-level and metalevel representations to be combined, as in natural language. For example, in the following program, the atomic formula `attends(Person, Meeting)` occurs both as an object-level formula, and as an argument of the metapredicates `prohibited` and `approved.`

prohibited(attends(Person, Meeting)) :- 
    not(approved(attends(Person, Meeting))).

should_receive_sanction(Person, scolding) :- attends(Person, Meeting), 
    lofty(Person), prohibited(attends(Person, Meeting)).
should_receive_sanction(Person, banishment) :- attends(Person, Meeting), 
    lowly(Person), prohibited(attends(Person, Meeting)).

approved(attends(alice, tea_party)).
attends(mad_hatter, tea_party).
attends(dormouse, tea_party).

lofty(mad_hatter).
lowly(dormouse).

?- should_receive_sanction(X,Y).
Person = mad_hatter,
Sanction = scolding.
Person = dormouse,
Sanction = banishment.

### Relationship with the [Computational-representational understanding of mind](https://en.wikipedia.org/wiki/Computational-representational_understanding_of_mind "Computational-representational understanding of mind")

In his popular Introduction to Cognitive Science,[[44]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-44) [Paul Thagard](https://en.wikipedia.org/wiki/Paul_Thagard "Paul Thagard") includes logic and [rules](https://en.wikipedia.org/wiki/Rule-based_system "Rule-based system") as alternative approaches to modelling human thinking. He argues that rules, which have the form _IF condition THEN action_, are "very similar" to logical conditionals, but they are simpler and have greater psychological plausibility (page 51). Among other differences between logic and rules, he argues that logic uses deduction, but rules use search (page 45) and can be used to reason either forward or backward (page 47). Sentences in logic "have to be interpreted as _universally true_", but rules can be _defaults_, which admit exceptions (page 44).

He states that "unlike logic, rule-based systems can also easily represent strategic information about what to do" (page 45). For example, "IF you want to go home for the weekend, and you have bus fare, THEN you can catch a bus". He does not observe that the same strategy of reducing a goal to subgoals can be interpreted, in the manner of logic programming, as applying backward reasoning to a logical conditional:

can_go(you, home) :- have(you, bus_fare), catch(you, bus).

All of these characteristics of rule-based systems - search, forward and backward reasoning, default reasoning, and goal-reduction - are also defining characteristics of logic programming. This suggests that Thagard's conclusion (page 56) that:

> Much of human knowledge is naturally described in terms of rules, and many kinds of thinking such as planning can be modeled by rule-based systems.

also applies to logic programming.

Other arguments showing how logic programming can be used to model aspects of human thinking are presented by [Keith Stenning](https://en.wikipedia.org/wiki/Keith_Stenning "Keith Stenning") and [Michiel van Lambalgen](https://en.wikipedia.org/wiki/Michiel_van_Lambalgen "Michiel van Lambalgen") in their book, Human Reasoning and Cognitive Science.[[45]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-45) They show how the non-monotonic character of logic programs can be used to explain human performance on a variety of psychological tasks. They also show (page 237) that "closed–world reasoning in its guise as logic programming has an appealing neural implementation, unlike classical logic."

In The Proper Treatment of Events,[[46]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-46) Michiel van Lambalgen and Fritz Hamm investigate the use of constraint logic programming to code "temporal notions in natural language by looking at the way human beings construct time".

### Knowledge representation

The use of logic to represent procedural knowledge and strategic information was one of the main goals contributing to the early development of logic programming. Moreover, it continues to be an important feature of the Prolog family of logic programming languages today. However, many applications of logic programming, including Prolog applications, increasingly focus on the use of logic to represent purely declarative knowledge. These applications include both the representation of general [commonsense](https://en.wikipedia.org/wiki/Commonsense_reasoning "Commonsense reasoning") knowledge and the representation of domain specific [expertise](https://en.wikipedia.org/wiki/Expert_system "Expert system").

Commonsense includes knowledge about cause and effect, as formalised, for example, in the [situation calculus](https://en.wikipedia.org/wiki/Situation_calculus "Situation calculus"), [event calculus](https://en.wikipedia.org/wiki/Event_calculus "Event calculus") and [action languages](https://en.wikipedia.org/wiki/Action_language "Action language"). Here is a simplified example, which illustrates the main features of such formalisms. The first clause states that a fact holds immediately after an event initiates (or causes) the fact. The second clause is a _[frame axiom](https://en.wikipedia.org/wiki/Frame_problem "Frame problem")_, which states that a fact that holds at a time continues to hold at the next time unless it is terminated by an event that happens at the time. This formulation allows more than one event to occur at the same time:

holds(Fact, Time2) :- 
    happens(Event, Time1),
    Time2 is Time1 + 1,
    initiates(Event, Fact).
     
holds(Fact, Time2) :- 
	happens(Event, Time1),
    Time2 is Time1 + 1,
    holds(Fact, Time1),
    not(terminated(Fact, Time1)).

terminated(Fact, Time) :-
   happens(Event, Time),
   terminates(Event, Fact).

Here `holds` is a meta-predicate, similar to `solve` above. However, whereas `solve` has only one argument, which applies to general clauses, the first argument of `holds` is a fact and the second argument is a time (or state). The atomic formula `holds(Fact, Time)` expresses that the `Fact` holds at the `Time`. Such time-varying facts are also called [fluents](https://en.wikipedia.org/wiki/Fluent_\(artificial_intelligence\) "Fluent (artificial intelligence)"). The atomic formula `happens(Event, Time)` expresses that the Event happens at the `Time`.

The following example illustrates how these clauses can be used to reason about causality in a toy [blocks world](https://en.wikipedia.org/wiki/Blocks_world "Blocks world"). Here, in the initial state at time 0, a green block is on a table and a red block is stacked on the green block (like a traffic light). At time 0, the red block is moved to the table. At time 1, the green block is moved onto the red block. Moving an object onto a place terminates the fact that the object is on any place, and initiates the fact that the object is on the place to which it is moved:

holds(on(green_block, table), 0).
holds(on(red_block, green_block), 0).

happens(move(red_block, table), 0).
happens(move(green_block, red_block), 1).

initiates(move(Object, Place), on(Object, Place)).
terminates(move(Object, Place2), on(Object, Place1)).

?- holds(Fact, Time).

Fact = on(green_block,table),
Time = 0.
Fact = on(red_block,green_block),
Time = 0.
Fact = on(green_block,table),
Time = 1.
Fact = on(red_block,table),
Time = 1.
Fact = on(green_block,red_block),
Time = 2.
Fact = on(red_block,table),
Time = 2.

Forward reasoning and backward reasoning generate the same answers to the goal `holds(Fact, Time)`. But forward reasoning generates fluents _progressively_ in temporal order, and backward reasoning generates fluents _regressively_, as in the domain-specific use of [regression](https://en.wikipedia.org/wiki/Situation_calculus#Regression "Situation calculus") in the [situation calculus](https://en.wikipedia.org/wiki/Situation_calculus "Situation calculus").[[47]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-47)

Logic programming has also proved to be useful for representing domain-specific expertise in [expert systems](https://en.wikipedia.org/wiki/Expert_system "Expert system").[[48]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-48) But human expertise, like general-purpose commonsense, is mostly implicit and [tacit](https://en.wikipedia.org/wiki/Tacit_knowledge "Tacit knowledge"), and it is often difficult to represent such implicit knowledge in explicit rules. This difficulty does not arise, however, when logic programs are used to represent the existing, explicit rules of a business organisation or legal authority.

For example, here is a representation of a simplified version of the first sentence of the British Nationality Act, which states that a person who is born in the UK becomes a British citizen at the time of birth if a parent of the person is a British citizen at the time of birth:

initiates(birth(Person), citizen(Person, uk)):-
    time_of(birth(Person), Time),
    place_of(birth(Person), uk),
    parent_child(Another_Person, Person),
    holds(citizen(Another_Person, uk), Time).

Historically, the representation of a large portion of the British Nationality Act as a logic program in the 1980s[[49]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-49) was "hugely influential for the development of computational representations of legislation, showing how logic programming enables intuitively appealing representations that can be directly deployed to generate automatic inferences".[[50]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-50)

More recently, the PROLEG system,[[51]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-51) initiated in 2009 and consisting of approximately 2500 rules and exceptions of civil code and supreme court case rules in Japan, has become possibly the largest legal rule base in the world.[[52]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-:02-52)

## Variants and extensions

### Prolog

Main article: [Prolog](https://en.wikipedia.org/wiki/Prolog "Prolog")

The SLD resolution rule of inference is neutral about the order in which subgoals in the bodies of clauses can be _selected_ for solution. For the sake of efficiency, Prolog restricts this order to the order in which the subgoals are written. SLD is also neutral about the strategy for searching the space of SLD proofs. Prolog searches this space, top-down, depth-first, trying different clauses for solving the same (sub)goal in the order in which the clauses are written.

This search strategy has the advantage that the current branch of the tree can be represented efficiently by a [stack](https://en.wikipedia.org/wiki/Stack_\(abstract_data_type\) "Stack (abstract data type)"). When a goal clause at the top of the stack is reduced to a new goal clause, the new goal clause is pushed onto the top of the stack. When the selected subgoal in the goal clause at the top of the stack cannot be solved, the search strategy _[backtracks](https://en.wikipedia.org/wiki/Backtracking "Backtracking")_, removing the goal clause from the top of the stack, and retrying the attempted solution of the selected subgoal in the previous goal clause using the next clause that matches the selected subgoal.

Backtracking can be restricted by using a subgoal, called _[cut](https://en.wikipedia.org/wiki/Cut_\(logic_programming\) "Cut (logic programming)")_, written as !, which always succeeds but cannot be backtracked. Cut can be used to improve efficiency, but can also interfere with the logical meaning of clauses. In many cases, the use of cut can be replaced by negation as failure. In fact, negation as failure can be defined in Prolog, by using cut, together with any literal, say _fail_, that unifies with the head of no clause:

not(P) :- P, !, fail.
not(P).

Prolog provides other features, in addition to cut, that do not have a logical interpretation. These include the built-in predicates _assert_ and _retract_ for destructively updating the state of the program during program execution.

For example, the [toy blocks world example above](https://en.wikipedia.org/wiki/Logic_programming#Knowledge_representation) can be implemented without frame axioms using destructive change of state:

on(green_block, table).
on(red_block, green_block).

move(Object, Place2) :- 
	retract(on(Object, Place1)), 
	assert(on(Object, Place2).

The sequence of move events and the resulting locations of the blocks can be computed by executing the query:

?- move(red_block, table), move(green_block, red_block), on(Object, Place).

Object = red_block,
Place = table.
Object = green_block,
Place = red_block.

Various extensions of logic programming have been developed to provide a logical framework for such destructive change of state.[[53]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-TL-53)[[54]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-54)[[55]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-55)

The broad range of Prolog applications, both in isolation and in combination with other languages is highlighted in the Year of Prolog Book,[[21]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Prolog_Book-21) celebrating the 50 year anniversary of Prolog in 2022.

Prolog has also contributed to the development of other programming languages, including [ALF](https://en.wikipedia.org/wiki/Algebraic_Logic_Functional_programming_language "Algebraic Logic Functional programming language"), [Fril](https://en.wikipedia.org/wiki/Fril "Fril"), [Gödel](https://en.wikipedia.org/wiki/G%C3%B6del_\(programming_language\) "Gödel (programming language)"), [Mercury](https://en.wikipedia.org/wiki/Mercury_programming_language "Mercury programming language"), [Oz](https://en.wikipedia.org/wiki/Oz_\(programming_language\) "Oz (programming language)"), [Ciao](https://en.wikipedia.org/wiki/Ciao_\(programming_language\) "Ciao (programming language)"), [Visual Prolog](https://en.wikipedia.org/wiki/Visual_Prolog "Visual Prolog"), [XSB](https://en.wikipedia.org/wiki/XSB "XSB"), and [λProlog](https://en.wikipedia.org/wiki/%CE%9BProlog "ΛProlog").

### Constraint logic programming

Main article: [Constraint logic programming](https://en.wikipedia.org/wiki/Constraint_logic_programming "Constraint logic programming")

[Constraint logic programming](https://en.wikipedia.org/wiki/Constraint_logic_programming "Constraint logic programming") (CLP) combines Horn clause logic programming with [constraint solving](https://en.wikipedia.org/wiki/Constraint_solving "Constraint solving"). It extends Horn clauses by allowing some predicates, declared as constraint predicates, to occur as literals in the body of a clause. Constraint predicates are not defined by the facts and rules in the program, but are predefined by some domain-specific model-theoretic structure or theory.

Procedurally, subgoals whose predicates are defined by the program are solved by goal-reduction, as in ordinary logic programming, but constraints are simplified and checked for satisfiability by a domain-specific constraint-solver, which implements the semantics of the constraint predicates. An initial problem is solved by reducing it to a satisfiable conjunction of constraints.

Interestingly, the first version of Prolog already included a constraint predicate dif(term1, term2), from Philippe Roussel's 1972 PhD thesis, which succeeds if both of its arguments are different terms, but which is delayed if either of the terms contains a variable.[[52]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-:02-52)

The following constraint logic program represents a toy temporal database of `john's` history as a teacher:

teaches(john, hardware, T) :- 1990 ≤ T, T < 1999.
teaches(john, software, T) :- 1999 ≤ T, T < 2005.
teaches(john, logic, T) :- 2005 ≤ T, T ≤ 2012.
rank(john, instructor, T) :- 1990 ≤ T, T < 2010.
rank(john, professor, T) :- 2010 ≤ T, T < 2014.

Here `≤` and `<` are constraint predicates, with their usual intended semantics. The following goal clause queries the database to find out when `john` both taught `logic` and was a `professor`:

?- teaches(john, logic, T), rank(john, professor, T).

The solution `2010 ≤ T, T ≤ 2012` results from simplifying the constraints `2005 ≤ T, T ≤ 2012, 2010 ≤ T, T < 2014.`

Constraint logic programming has been used to solve problems in such fields as [civil engineering](https://en.wikipedia.org/wiki/Civil_engineering "Civil engineering"), [mechanical engineering](https://en.wikipedia.org/wiki/Mechanical_engineering "Mechanical engineering"), [digital circuit](https://en.wikipedia.org/wiki/Digital_circuit "Digital circuit") verification, [automated timetabling](https://en.wikipedia.org/wiki/Automated_timetabling "Automated timetabling"), [air traffic control](https://en.wikipedia.org/wiki/Air_traffic_control "Air traffic control"), and finance. It is closely related to [abductive logic programming](https://en.wikipedia.org/wiki/Abductive_logic_programming "Abductive logic programming").

### Datalog

Main article: [Datalog](https://en.wikipedia.org/wiki/Datalog "Datalog")

Datalog is a database definition language, which combines a relational view of data, as in [relational databases](https://en.wikipedia.org/wiki/Relational_database "Relational database"), with a logical view, as in logic programming.

Relational databases use a relational calculus or relational algebra, with [relational operations](https://en.wikipedia.org/wiki/Relational_database#Relational_operations "Relational database"), such as _union_, _intersection_, _set difference_ and _cartesian product_ to specify queries, which access a database. Datalog uses logical connectives, such as _or_, _and_ and _not_ in the bodies of rules to define relations as part of the database itself.

It was recognized early in the development of relational databases that recursive queries cannot be expressed in either relational algebra or relational calculus, and that this deficiency can be remedied by introducing a least-fixed-point operator.[[56]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-56)[[57]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-57) In contrast, recursive relations can be defined naturally by rules in logic programs, without the need for any new logical connectives or operators.

Datalog differs from more general logic programming by having only constants and variables as terms. Moreover, all facts are variable-free, and rules are restricted, so that if they are executed bottom-up, then the derived facts are also variable-free.

For example, consider the family database:

mother_child(elizabeth, charles).
father_child(charles, william).
father_child(charles, harry).
parent_child(X, Y) :- 
     mother_child(X, Y).
parent_child(X, Y) :- 
     father_child(X, Y).
ancestor_descendant(X, Y) :- 
     parent_child(X, X).
ancestor_descendant(X, Y) :- 
     ancestor_descendant(X, Z), 
     ancestor_descendant(Z, Y).

Bottom-up execution derives the following set of additional facts and terminates:

parent_child(elizabeth, charles).
parent_child(charles, william).
parent_child(charles, harry).

ancestor_descendant(elizabeth, charles).
ancestor_descendant(charles, william).
ancestor_descendant(charles, harry).

ancestor_descendant(elizabeth, william).
ancestor_descendant(elizabeth, harry).

Top-down execution derives the same answers to the query:

?- ancestor_descendant(X, Y).

But then it goes into an infinite loop. However, top-down execution with [tabling](https://en.wikipedia.org/wiki/Tabled_logic_programming "Tabled logic programming") gives the same answers and terminates without looping.

### Answer set programming

Main article: [Answer Set Programming](https://en.wikipedia.org/wiki/Answer_Set_Programming "Answer Set Programming")

Like Datalog, Answer Set programming (ASP) is not Turing-complete. Moreover, instead of separating goals (or queries) from the program to be used in solving the goals, ASP treats the whole program as a goal, and solves the goal by generating a stable model that makes the goal true. For this purpose, it uses the [stable model semantics](https://en.wikipedia.org/wiki/Stable_model_semantics "Stable model semantics"), according to which a logic program can have zero, one or more intended models. For example, the following program represents a degenerate variant of the map colouring problem of colouring two countries red or green:

country(oz).
country(iz).
adjacent(oz, iz).
colour(C, red) :- country(C), not(colour(C, green)).
colour(C, green) :- country(C), not(colour(C, red)).

The problem has four solutions represented by four stable models:

country(oz). country(iz). adjacent(oz, iz). colour(oz, red).   colour(iz, red).

country(oz). country(iz). adjacent(oz, iz). colour(oz, green). colour(iz, green).

country(oz). country(iz). adjacent(oz, iz). colour(oz, red).   colour(iz, green).

country(oz). country(iz). adjacent(oz, iz). colour(oz, green). colour(iz, red).

To represent the standard version of the map colouring problem, we need to add a constraint that two adjacent countries cannot be coloured the same colour. In ASP, this constraint can be written as a clause of the form:

:- country(C1), country(C2), adjacent(C1, C2), colour(C1, X), colour(C2, X).

With the addition of this constraint, the problem now has only two solutions:

country(oz). country(iz). adjacent(oz, iz). colour(oz, red).   colour(iz, green).

country(oz). country(iz). adjacent(oz, iz). colour(oz, green). colour(iz, red).

The addition of constraints of the form `:- Body.` eliminates models in which `Body` is true.

Confusingly, _constraints in ASP_ are different from _constraints in CLP_. Constraints in CLP are predicates that qualify answers to queries (and solutions of goals). Constraints in ASP are clauses that eliminate models that would otherwise satisfy goals. Constraints in ASP are like integrity constraints in databases.

This combination of ordinary logic programming clauses and constraint clauses illustrates the generate-and-test methodology of problem solving in ASP: The ordinary clauses define a search space of possible solutions, and the constraints filter out unwanted solutions.[[58]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-58)

Most implementations of ASP proceed in two steps: First they instantiate the program in all possible ways, reducing it to a propositional logic program (known as _grounding_). Then they apply a propositional logic problem solver, such as the [DPLL algorithm](https://en.wikipedia.org/wiki/DPLL_algorithm "DPLL algorithm") or a [Boolean SAT solver](https://en.wikipedia.org/wiki/Boolean_SAT_solver "Boolean SAT solver"). However, some implementations, such as s(CASP)[[59]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-59) use a goal-directed, top-down, SLD resolution-like procedure without grounding.

### Abductive logic programming

Main article: [Abductive logic programming](https://en.wikipedia.org/wiki/Abductive_logic_programming "Abductive logic programming")

[Abductive logic programming](https://en.wikipedia.org/wiki/Abductive_logic_programming "Abductive logic programming")[[60]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-60) (ALP), like CLP, extends normal logic programming by allowing the bodies of clauses to contain literals whose predicates are not defined by clauses. In ALP, these predicates are declared as _abducible_ (or _assumable_), and are used as in [abductive reasoning](https://en.wikipedia.org/wiki/Abductive_reasoning#Formalizations_of_abduction#Logic-based_abduction "Abductive reasoning") to explain observations, or more generally to add new facts to the program (as assumptions) to solve goals.

For example, suppose we are given an initial state in which a red block is on a green block on a table at time 0:

holds(on(green_block, table), 0).
holds(on(red_block, green_block), 0).

Suppose we are also given the goal:

?- holds(on(green_block,red_block), 3), holds(on(red_block,table), 3).

The goal can represent an observation, in which case a solution is an explanation of the observation. Or the goal can represent a desired future state of affairs, in which case a solution is a plan for achieving the goal.[[61]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-61)

We can use the rules for cause and effect presented earlier to solve the goal, by treating the `happens` predicate as abducible:

holds(Fact, Time2) :- 
    happens(Event, Time1),
    Time2 is Time1 + 1,
    initiates(Event, Fact).
     
holds(Fact, Time2) :- 
	happens(Event, Time1),
    Time2 is Time1 + 1,
    holds(Fact, Time1),
    not(terminated(Fact, Time1)).
    
terminated(Fact, Time) :-
   happens(Event, Time),
   terminates(Event, Fact).

initiates(move(Object, Place), on(Object, Place)).
terminates(move(Object, Place2), on(Object, Place1)).

ALP solves the goal by reasoning backwards and adding assumptions to the program, to solve abducible subgoals. In this case there are many alternative solutions, including:

happens(move(red_block, table), 0).
happens(tick, 1).
happens(move(green_block, red_block), 2).

happens(tick,0).
happens(move(red_block, table), 1).
happens(move(green_block, red_block), 2).

happens(move(red_block, table), 0).
happens(move(green_block, red_block), 1).
happens(tick, 2).

Here `tick` is an event that marks the passage of time without initiating or terminating any fluents.

There are also solutions in which the two `move` events happen at the same time. For example:

happens(move(red_block, table), 0).
happens(move(green_block, red_block), 0).
happens(tick, 1).
happens(tick, 2).

Such solutions, if not desired, can be removed by adding an integrity constraint, which is like a constraint clause in ASP:

:- happens(move(Block1, Place), Time), happens(move(Block2, Block1), Time).

Abductive logic programming has been used for fault diagnosis, planning, natural language processing and machine learning. It has also been used to interpret negation as failure as a form of abductive reasoning.[[62]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-62)

### Inductive logic programming

Main article: [Inductive logic programming](https://en.wikipedia.org/wiki/Inductive_logic_programming "Inductive logic programming")

Inductive logic programming (ILP) is an approach to [machine learning](https://en.wikipedia.org/wiki/Machine_learning "Machine learning") that [induces](https://en.wikipedia.org/wiki/Inductive_reasoning "Inductive reasoning") logic programs as hypothetical generalisations of positive and negative examples. Given a logic program representing background knowledge and positive examples together with constraints representing negative examples, an ILP system induces a logic program that generalises the positive examples while excluding the negative examples.

ILP is similar to ALP, in that both can be viewed as generating hypotheses to explain observations, and as employing constraints to exclude undesirable hypotheses. But in ALP the hypotheses are variable-free facts, and in ILP the hypotheses are general rules.[[63]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-63)[[64]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-64)

For example, given only background knowledge of the mother_child and father_child relations, and suitable examples of the grandparent_child relation, current ILP systems can generate the definition of grandparent_child, inventing an auxiliary predicate, which can be interpreted as the parent_child relation:[[65]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-65)

grandparent_child(X, Y):- auxiliary(X, Z), auxiliary(Z, Y).
auxiliary(X, Y):- mother_child(X, Y).
auxiliary(X, Y):- father_child(X, Y).

Stuart Russell[[66]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-66) has referred to such invention of new concepts as the most important step needed for reaching human-level AI.

Recent work in ILP, combining logic programming, learning and probability, has given rise to the fields of [statistical relational learning](https://en.wikipedia.org/wiki/Statistical_relational_learning "Statistical relational learning") and [probabilistic inductive logic programming](https://en.wikipedia.org/wiki/Probabilistic_inductive_logic_programming "Probabilistic inductive logic programming").

### Concurrent logic programming

Main article: [Concurrent logic programming](https://en.wikipedia.org/wiki/Concurrent_logic_programming "Concurrent logic programming")

Concurrent logic programming integrates concepts of logic programming with [concurrent programming](https://en.wikipedia.org/wiki/Concurrent_programming "Concurrent programming"). Its development was given a big impetus in the 1980s by its choice for the systems programming language of the [Japanese Fifth Generation Project (FGCS)](https://en.wikipedia.org/wiki/Fifth_generation_computer "Fifth generation computer").[[67]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-67)

A concurrent logic program is a set of guarded [Horn clauses](https://en.wikipedia.org/wiki/Horn_clauses "Horn clauses") of the form:

`H :- G1, ..., Gn | B1, ..., Bn.`

The conjunction `G1, ... , Gn` is called the [guard](https://en.wikipedia.org/wiki/Guard_\(computer_science\) "Guard (computer science)") of the clause, and | is the commitment operator. Declaratively, guarded Horn clauses are read as ordinary logical implications:

`H if G1 and ... and Gn and B1 and ... and Bn.`

However, procedurally, when there are several clauses whose heads `H` match a given goal, then all of the clauses are executed in parallel, checking whether their guards `G1, ... , Gn` hold. If the guards of more than one clause hold, then a committed choice is made to one of the clauses, and execution proceeds with the subgoals `B1, ..., Bn` of the chosen clause. These subgoals can also be executed in parallel. Thus concurrent logic programming implements a form of "don't care nondeterminism", rather than "don't know nondeterminism".

For example, the following concurrent logic program defines a predicate `shuffle(Left, Right, Merge)`, which can be used to shuffle two lists `Left` and `Right`, combining them into a single list `Merge` that preserves the ordering of the two lists `Left` and `Right`:

shuffle([], [], []).
shuffle(Left, Right, Merge) :-
    Left = [First | Rest] |
    Merge = [First | ShortMerge],
    shuffle(Rest, Right, ShortMerge).
shuffle(Left, Right, Merge) :-
    Right = [First | Rest] |
    Merge = [First | ShortMerge],
    shuffle(Left, Rest, ShortMerge).

Here, `[]` represents the empty list, and `[Head | Tail]` represents a list with first element `Head` followed by list `Tail`, as in Prolog. (Notice that the first occurrence of | in the second and third clauses is the list constructor, whereas the second occurrence of | is the commitment operator.) The program can be used, for example, to shuffle the lists `[ace, queen, king]` and `[1, 4, 2]` by invoking the goal clause:

shuffle([ace, queen, king], [1, 4, 2], Merge).

The program will non-deterministically generate a single solution, for example `Merge = [ace, queen, 1, king, 4, 2]`.

[Carl Hewitt](https://en.wikipedia.org/wiki/Carl_Hewitt "Carl Hewitt") has argued[[68]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-Hewitt-68) that, because of the [indeterminacy of concurrent computation](https://en.wikipedia.org/wiki/Indeterminacy_in_concurrent_computation "Indeterminacy in concurrent computation"), concurrent logic programming cannot implement general concurrency. However, according to the logical semantics, any result of a computation of a concurrent logic program is a logical consequence of the program, even though not all logical consequences can be derived.

### Concurrent constraint logic programming

Main article: [Concurrent constraint logic programming](https://en.wikipedia.org/wiki/Concurrent_constraint_logic_programming "Concurrent constraint logic programming")

[Concurrent constraint logic programming](https://en.wikipedia.org/wiki/Concurrent_constraint_logic_programming "Concurrent constraint logic programming")[[69]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-69) combines concurrent logic programming and [constraint logic programming](https://en.wikipedia.org/wiki/Constraint_logic_programming "Constraint logic programming"), using constraints to control concurrency. A clause can contain a guard, which is a set of constraints that may block the applicability of the clause. When the guards of several clauses are satisfied, concurrent constraint logic programming makes a committed choice to use only one.

### Higher-order logic programming

Several researchers have extended logic programming with [higher-order programming](https://en.wikipedia.org/wiki/Higher-order_programming "Higher-order programming") features derived from [higher-order logic](https://en.wikipedia.org/wiki/Higher-order_logic "Higher-order logic"), such as predicate variables. Such languages include the Prolog extensions [HiLog](https://en.wikipedia.org/wiki/HiLog "HiLog")[[70]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-hilog-jlp-70) and [λProlog](https://en.wikipedia.org/wiki/%CE%9BProlog "ΛProlog").[[71]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-71)

### Linear logic programming

Basing logic programming within [linear logic](https://en.wikipedia.org/wiki/Linear_logic "Linear logic") has resulted in the design of logic programming languages that are considerably more expressive than those based on classical logic. Horn clause programs can only represent state change by the change in arguments to predicates. In linear logic programming, one can use the ambient linear logic to support state change. Some early designs of logic programming languages based on linear logic include LO,[[72]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-72) Lolli,[[73]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-73) ACL,[[74]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-74) and Forum.[[75]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-75) Forum provides a goal-directed interpretation of all linear logic.

### Object-oriented logic programming

[F-logic](https://en.wikipedia.org/wiki/F-logic "F-logic")[[76]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-76) extends logic programming with objects and the frame syntax.

[Logtalk](https://en.wikipedia.org/wiki/Logtalk "Logtalk")[[77]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-77) extends the Prolog programming language with support for objects, protocols, and other OOP concepts. It supports most standard-compliant Prolog systems as backend compilers.

### Transaction logic programming

[Transaction logic](https://en.wikipedia.org/wiki/Transaction_logic "Transaction logic")[[53]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-TL-53) is an extension of logic programming with a logical theory of state-modifying updates. It has both a model-theoretic semantics and a procedural one. An implementation of a subset of Transaction logic is available in the [Flora-2](https://en.wikipedia.org/wiki/Flora-2 "Flora-2")[[78]](https://en.wikipedia.org/wiki/Logic_programming#cite_note-78) system. Other prototypes are also [available](https://en.wikipedia.org/wiki/Transaction_logic "Transaction logic").


---


**Rules of inference** are ways of deriving conclusions from [premises](https://en.wikipedia.org/wiki/Premise "Premise"). They are integral parts of [formal logic](https://en.wikipedia.org/wiki/Formal_logic), serving as the [logical structure](https://en.wikipedia.org/wiki/Logical_form "Logical form") of [valid](https://en.wikipedia.org/wiki/Validity_\(logic\) "Validity (logic)") arguments. If an argument with true premises follows a rule of inference then the conclusion cannot be false. _[Modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens")_, an influential rule of inference, connects two premises of the form "if P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) then Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed)" and "P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a)" to the conclusion "Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed)", as in the argument "If it rains, then the ground is wet. It rains. Therefore, the ground is wet." There are many other rules of inference for different patterns of valid arguments, such as _[modus tollens](https://en.wikipedia.org/wiki/Modus_tollens "Modus tollens")_, [disjunctive syllogism](https://en.wikipedia.org/wiki/Disjunctive_syllogism "Disjunctive syllogism"), [constructive dilemma](https://en.wikipedia.org/wiki/Constructive_dilemma "Constructive dilemma"), and [existential generalization](https://en.wikipedia.org/wiki/Existential_generalization "Existential generalization").

Rules of inference include rules of implication, which operate only in one direction from premises to conclusions, and [rules of replacement](https://en.wikipedia.org/wiki/Rules_of_replacement "Rules of replacement"), which state that two expressions are equivalent and can be freely swapped. They contrast with [formal fallacies](https://en.wikipedia.org/wiki/Formal_fallacies "Formal fallacies")—invalid argument forms involving logical errors.

Logicians construct [formal systems](https://en.wikipedia.org/wiki/Formal_systems "Formal systems") to precisely capture and codify valid patterns of reasoning, with distinct systems using different rules of inference. For example, [propositional logic](https://en.wikipedia.org/wiki/Propositional_logic "Propositional logic") examines how [statements](https://en.wikipedia.org/wiki/Proposition "Proposition") formed through logical operators like "not" and "if...then..." support conclusions. [First-order logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic") extends propositional logic by analyzing how the internal structure of propositions, like names and [predicates](https://en.wikipedia.org/wiki/Predicate_\(logic\) "Predicate (logic)"), influences reasoning. Other logical systems explore inferential patterns associated with [what is possible and necessary](https://en.wikipedia.org/wiki/Modal_logic "Modal logic"), with [what people believe](https://en.wikipedia.org/wiki/Doxastic_logic "Doxastic logic"), and with [what happened at different times](https://en.wikipedia.org/wiki/Temporal_logic "Temporal logic"). Various formalisms are used to express logical systems. [Natural deduction](https://en.wikipedia.org/wiki/Natural_deduction "Natural deduction") systems employ many intuitive rules of inference to reflect how people naturally reason, while [Hilbert systems](https://en.wikipedia.org/wiki/Hilbert_system "Hilbert system") provide minimalistic frameworks to represent foundational principles without redundancy.

Rules of inference are relevant to many areas, such as [proofs](https://en.wikipedia.org/wiki/Mathematical_proof "Mathematical proof") in [mathematics](https://en.wikipedia.org/wiki/Mathematics "Mathematics") and [automated reasoning](https://en.wikipedia.org/wiki/Automated_reasoning "Automated reasoning") in [computer science](https://en.wikipedia.org/wiki/Computer_science "Computer science"). Their conceptual and psychological underpinnings are studied by [philosophers of logic](https://en.wikipedia.org/wiki/Philosophy_of_logic "Philosophy of logic") and [cognitive psychologists](https://en.wikipedia.org/wiki/Cognitive_psychology "Cognitive psychology").

## Definition

A rule of [inference](https://en.wikipedia.org/wiki/Inference "Inference") is a way of drawing a conclusion from a set of [premises](https://en.wikipedia.org/wiki/Premise "Premise").[[1]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-1) Also called _inference rule_ and _transformation rule_,[[2]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-2) it is a norm of correct inferences that can be used to guide [reasoning](https://en.wikipedia.org/wiki/Logical_reasoning "Logical reasoning"), justify conclusions, and criticize [arguments](https://en.wikipedia.org/wiki/Argument "Argument"). As part of [deductive](https://en.wikipedia.org/wiki/Deductive_reasoning "Deductive reasoning") logic, rules of inference are argument forms that preserve the [truth](https://en.wikipedia.org/wiki/Truth "Truth") of the premises, meaning that the conclusion is always true if the premises are true.[[a]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-4) An inference is deductively [valid](https://en.wikipedia.org/wiki/Validity_\(logic\) "Validity (logic)") if it follows a correct rule of inference. Whether this is the case depends only on the [form or syntactic structure](https://en.wikipedia.org/wiki/Logical_form "Logical form") of the premises and the conclusion, that is, the actual content or concrete meaning of the statements does not affect validity. For instance, _[modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens")_ is a rule of inference that connects two premises of the form "if P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) then Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed)" and "P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a)" to the conclusion "Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed)". The letters P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed) in this example and in later formulas are so-called [metavariables](https://en.wikipedia.org/wiki/Metavariable "Metavariable"): they stand for any simple or compound [proposition](https://en.wikipedia.org/wiki/Proposition "Proposition").[[4]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto2-5) Any argument following _modus ponens_ is valid, independent of the specific meanings of P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), such as the argument "If it is day, then it is light. It is day. Therefore, it is light."[[5]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-6) In addition to '_modus ponens_, there are many other rules of inference, such as _[modus tollens](https://en.wikipedia.org/wiki/Modus_tollens "Modus tollens")_, [disjunctive syllogism](https://en.wikipedia.org/wiki/Disjunctive_syllogism "Disjunctive syllogism"), and [constructive dilemma](https://en.wikipedia.org/wiki/Constructive_dilemma "Constructive dilemma").[[4]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto2-5)

There are different formats to represent rules of inference. A common approach is to use a new line for each premise and to separate the premises from the conclusion using a horizontal line. With this format, _modus ponens_ is written as:[[6]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-7)[[b]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-9)P→QPQ![{\displaystyle {\begin{array}{l}P\to Q\\P\\\hline Q\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f24b08f817df9aa00c74ba19011c50a823ac942e)

Some logicians employ the [therefore sign](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") (∴![{\displaystyle \therefore }](https://wikimedia.org/api/rest_v1/media/math/render/svg/fbb8b7f072bd54b28a08d8f7ad207f9df1bf9f22)) either together with or instead of the horizontal line to indicate where the conclusion begins.[[8]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-10) The [sequent](https://en.wikipedia.org/wiki/Sequent "Sequent") notation, a different approach, uses a single line in which the premises are separated by commas and connected to the conclusion with the [turnstile symbol](https://en.wikipedia.org/wiki/Turnstile_symbol "Turnstile symbol") (⊢![{\displaystyle \vdash }](https://wikimedia.org/api/rest_v1/media/math/render/svg/a0c0d30cf8cb7dba179e317fcde9583d842e80f6)), as in P→Q,P⊢Q![{\displaystyle P\to Q,P\vdash Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/2f6b1bf712367f9c2db9774415f397953dda2fc8).[[9]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-11)

Rules of inference are part of [logical systems](https://en.wikipedia.org/wiki/Formal_system "Formal system") and different systems employ distinct sets of rules. For example, [universal instantiation](https://en.wikipedia.org/wiki/Universal_instantiation "Universal instantiation")[[c]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-13) is a rule of inference in the system of [first-order logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic") but not in [propositional logic](https://en.wikipedia.org/wiki/Propositional_logic "Propositional logic").[[11]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-14) Rules of inference play a central role in [proofs](https://en.wikipedia.org/wiki/Formal_proof "Formal proof") as explicit procedures for deriving new lines of a proof from preceding lines. Proofs involve a series of inferential steps and often use various rules of inference to establish the [theorem](https://en.wikipedia.org/wiki/Theorem "Theorem") they intend to demonstrate.[[12]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-15)[[d]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-17) Rules of inference are definitory rules—rules about which inferences are allowed. They contrast with strategic rules, which govern the inferential steps needed to prove a certain theorem from a specific set of premises. Mastering definitory rules by itself is not sufficient for effective reasoning since they provide little guidance on how to reach the intended conclusion.[[14]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-18)[[e]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-20) As standards or procedures governing the transformation of symbolic expressions, rules of inference are similar to [mathematical functions](https://en.wikipedia.org/wiki/Mathematical_function "Mathematical function") taking premises as input and producing a conclusion as output. According to one interpretation, rules of inference are inherent in [logical operators](https://en.wikipedia.org/wiki/Logical_operator "Logical operator")[[f]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-22) found in statements, making the meaning and function of these operators explicit without adding any additional information.[[17]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-23)

[![Black-and-white drawing of a man with sideburns, dressed in a dark formal attire with a white high-collared shirt](https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/PSM_V17_D740_George_Boole.jpg/250px-PSM_V17_D740_George_Boole.jpg)](https://en.wikipedia.org/wiki/File:PSM_V17_D740_George_Boole.jpg)

[George Boole](https://en.wikipedia.org/wiki/George_Boole "George Boole") (1815–1864) made key contributions to symbolic logic in general and propositional logic in particular.[[18]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-24)

Logicians distinguish two types of rules of inference: rules of implication and [rules of replacement](https://en.wikipedia.org/wiki/Rules_of_replacement "Rules of replacement").[[g]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-26) Rules of implication, like _modus ponens_, operate only in one direction, meaning that the conclusion can be deduced from the premises, but the premises cannot be deduced from the conclusion. Rules of replacement, by contrast, operate in both directions, stating that two expressions are equivalent and can be freely replaced with each other. In classical logic, for example, a proposition (P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a)) is equivalent to the negation[[h]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-28) of its negation (¬¬P![{\displaystyle \lnot \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd7b2854acecb0e4c6656bb881edc564cb441668)).[[i]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-30) As a result, one can infer one from the other in either direction, making it a rule of replacement. Other rules of replacement include [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws "De Morgan's laws") as well as the [commutative](https://en.wikipedia.org/wiki/Commutative_property "Commutative property") and [associative properties](https://en.wikipedia.org/wiki/Associative_property "Associative property") of [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction "Logical conjunction") and [disjunction](https://en.wikipedia.org/wiki/Logical_disjunction "Logical disjunction"). While rules of implication apply only to complete statements, rules of replacement can be applied to any part of a compound statement.[[22]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-31)

Deductive rules of inference differ from defeasible [argumentation schemes](https://en.wikipedia.org/wiki/Argumentation_scheme "Argumentation scheme"), which describe patterns of reasoning that provide some support to a conclusion without guaranteeing its truth, such as the [argument from authority](https://en.wikipedia.org/wiki/Argument_from_authority "Argument from authority") and the [argument from analogy](https://en.wikipedia.org/wiki/Argument_from_analogy "Argument from analogy"). However, the term "rule of inference" is sometimes used in a looser sense to include non-deductive argumentation schemes.[[23]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-32) Similarly, the term is occasionally interpreted broadly to include general standards of research, such as the principle that [scientific experiments](https://en.wikipedia.org/wiki/Scientific_experiments "Scientific experiments") should be [replicable](https://en.wikipedia.org/wiki/Reproducibility "Reproducibility").[[24]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-33)

One of the first discussions of formal rules of inference dates to [antiquity](https://en.wikipedia.org/wiki/Ancient_history "Ancient history"), in [Aristotle's logic](https://en.wikipedia.org/wiki/Aristotle%27s_logic "Aristotle's logic"). His explanations of valid [syllogisms](https://en.wikipedia.org/wiki/Syllogisms "Syllogisms") were further refined in [medieval](https://en.wikipedia.org/wiki/Medieval_philosophy "Medieval philosophy") and [early modern philosophy](https://en.wikipedia.org/wiki/Early_modern_philosophy "Early modern philosophy"). The development of [symbolic logic](https://en.wikipedia.org/wiki/Symbolic_logic "Symbolic logic") in the 19th century, such as [George Boole](https://en.wikipedia.org/wiki/George_Boole "George Boole")'s articulation of [Boolean algebra](https://en.wikipedia.org/wiki/Boolean_algebra "Boolean algebra"), led to the formulation of many additional rules of inference belonging to [classical](https://en.wikipedia.org/wiki/Classical_logic "Classical logic") propositional and first-order logic. In the 20th and 21st centuries, logicians developed various [non-classical](https://en.wikipedia.org/wiki/Non-classical_logic "Non-classical logic") systems of logic with alternative rules of inference.[[25]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-34)

## Basic concepts

Rules of inference describe the structure of arguments, which consist of premises that support a conclusion.[[26]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-35) Premises and conclusions are statements or propositions about what is true. For instance, the assertion "The door is open." is a statement that is either true or false, while the question "Is the door open?" and the command "Open the door!" are not statements and have no truth value.[[27]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-36) An inference is a step of reasoning from premises to a conclusion, while an argument is the outward expression of an inference.[[28]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-37)

[Logic](https://en.wikipedia.org/wiki/Logic "Logic") is the study of correct reasoning and examines how to distinguish good from bad arguments.[[29]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-38) Deductive logic is the branch that investigates the strongest arguments, called deductively valid arguments, for which the conclusion cannot be false if all the premises are true. This is expressed by saying that the conclusion is a [logical consequence](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence") of the premises. Rules of inference belong to deductive logic and describe argument forms that fulfill this requirement.[[30]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-39) In order to precisely assess whether an argument follows a rule of inference, logicians use [formal languages](https://en.wikipedia.org/wiki/Formal_languages "Formal languages") to express statements in a rigorous manner, similar to [mathematical formulas](https://en.wikipedia.org/wiki/Mathematical_formula "Mathematical formula").[[31]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-40) They combine formal languages with rules of inference to construct [formal systems](https://en.wikipedia.org/wiki/Formal_systems "Formal systems")—frameworks for formulating propositions and drawing conclusions.[[j]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-42) Different formal systems may employ different formal languages or different rules of inference.[[33]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-43)[[k]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-45) The basic rules of inference within a formal system can often be expanded by introducing new rules, known as _[admissible rules](https://en.wikipedia.org/wiki/Admissible_rule "Admissible rule")_. Admissible rules do not change which arguments in a formal system are valid but can simplify proofs. If an admissible rule can be expressed through a combination of the system's basic rules, it is called a _derived_ or _derivable rule_.[[35]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-46) Statements that can be deduced in a formal system are called _[theorems](https://en.wikipedia.org/wiki/Theorem "Theorem")_ of this formal system.[[36]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-47) Widely used systems of logic include [propositional logic](https://en.wikipedia.org/wiki/Propositional_logic "Propositional logic"), [first-order logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic"), and [modal logic](https://en.wikipedia.org/wiki/Modal_logic "Modal logic").[[37]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-48)

Rules of inference only ensure that the conclusion is true if the premises are true. An argument with false premises can still be valid, but its conclusion may be false. For example, the argument "If pigs can fly, then the sky is purple. Pigs can fly. Therefore, the sky is purple." is valid because it follows _modus ponens_, even though it contains false premises. A valid argument is called a _[sound argument](https://en.wikipedia.org/wiki/Soundness "Soundness")_ if all of its premises are true.[[38]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-49)

Rules of inference are closely related to [tautologies](https://en.wikipedia.org/wiki/Tautology_\(logic\) "Tautology (logic)") or [logical truths](https://en.wikipedia.org/wiki/Logical_truth "Logical truth"). In logic, a tautology is a statement that is true only because of the logical vocabulary it uses, independent of the meanings of its non-logical vocabulary. For example, the statement "if the tree is green and the sky is blue then the tree is green" is true independently of the meanings of terms like _tree_ and _green_, making it a tautology. Every argument following a rule of inference can be transformed into a tautology. This is achieved by forming a [conjunction](https://en.wikipedia.org/wiki/Logical_conjunction "Logical conjunction") (_and_) of all premises and connecting it through [implication](https://en.wikipedia.org/wiki/Material_conditional "Material conditional") (_if ... then ..._) to the conclusion, thereby combining all the individual statements of the argument into a single statement. For example, the valid argument "The tree is green and the sky is blue. Therefore, the tree is green." can be transformed into the tautology "if the tree is green and the sky is blue then the tree is green".[[39]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-50)

Rules of inference are not the only way to demonstrate that an argument is valid. Alternative methods include the use of [truth tables](https://en.wikipedia.org/wiki/Truth_table "Truth table"), which apply to propositional logic, and [truth trees](https://en.wikipedia.org/wiki/Truth_tree "Truth tree"), which can also be employed in first-order logic.[[40]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-51)

## Systems of logic

### Classical

#### Propositional logic

Main article: [Propositional logic](https://en.wikipedia.org/wiki/Propositional_logic "Propositional logic")

Propositional logic examines the inferential patterns of simple and compound [propositions](https://en.wikipedia.org/wiki/Proposition "Proposition"). It uses letters, such as P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), to represent simple propositions. Compound propositions are formed by modifying or combining simple propositions with [logical operators](https://en.wikipedia.org/wiki/Logical_operator "Logical operator"), such as ¬![{\displaystyle \lnot }](https://wikimedia.org/api/rest_v1/media/math/render/svg/099107443792f5fec9bebe39b919a690db7198c1) (_not_), ∧![{\displaystyle \land }](https://wikimedia.org/api/rest_v1/media/math/render/svg/d6823e5a222eb3ca49672818ac3d13ec607052c4) (_and_), ∨![{\displaystyle \lor }](https://wikimedia.org/api/rest_v1/media/math/render/svg/ab47f6b1f589aedcf14638df1d63049d233d851a) (_or_), and →![{\displaystyle \to }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1daab843254cfcb23a643070cf93f3badc4fbbbd) (_if ... then ..._). For example, if P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) stands for the statement "it is raining" and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed) stands for the statement "the streets are wet", then ¬P![{\displaystyle \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/38a32afb77c17696c41588f6deaf9bcd7109b10c) expresses "it is not raining" and P→Q![{\displaystyle P\to Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d7cad5b2c2991ae1dbded560c5d875fbf49fe8ea) expresses "if it is raining then the streets are wet". These logical operators are [truth-functional](https://en.wikipedia.org/wiki/Truth-functional "Truth-functional"), meaning that the truth value of a compound proposition depends only on the truth values of the simple propositions composing it. For instance, the compound proposition P∧Q![{\displaystyle P\land Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c5690bb4822d8c821a00cfe3c6644b046a884af4) is only true if both P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed) are true; in all other cases, it is false. Propositional logic is not concerned with the concrete meaning of propositions other than their truth values.[[41]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-52) Key rules of inference in propositional logic are _[modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens")_, _[modus tollens](https://en.wikipedia.org/wiki/Modus_tollens "Modus tollens")_, [hypothetical syllogism](https://en.wikipedia.org/wiki/Hypothetical_syllogism "Hypothetical syllogism"), [disjunctive syllogism](https://en.wikipedia.org/wiki/Disjunctive_syllogism "Disjunctive syllogism"), and [double negation elimination](https://en.wikipedia.org/wiki/Double_negation_elimination "Double negation elimination"). Further rules include [conjunction introduction](https://en.wikipedia.org/wiki/Conjunction_introduction "Conjunction introduction"), [conjunction elimination](https://en.wikipedia.org/wiki/Conjunction_elimination "Conjunction elimination"), [disjunction introduction](https://en.wikipedia.org/wiki/Disjunction_introduction "Disjunction introduction"), [disjunction elimination](https://en.wikipedia.org/wiki/Disjunction_elimination "Disjunction elimination"), [constructive dilemma](https://en.wikipedia.org/wiki/Constructive_dilemma "Constructive dilemma"), [destructive dilemma](https://en.wikipedia.org/wiki/Destructive_dilemma "Destructive dilemma"), [absorption](https://en.wikipedia.org/wiki/Absorption_\(logic\) "Absorption (logic)"), and [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws "De Morgan's laws").[[42]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-53)

|   |   |   |
|---|---|---|
Notable rules of inference[[43]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-54)
|Rule of inference|Form|Example|
|_Modus ponens_|P→QPQ![{\displaystyle {\begin{array}{l}P\to Q\\P\\\hline Q\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f24b08f817df9aa00c74ba19011c50a823ac942e)|If Kim is in Seoul, then Kim is in South Korea.Kim is in Seoul.Therefore, Kim is in South Korea.![{\displaystyle {\begin{array}{l}{\text{If Kim is in Seoul, then Kim is in South Korea.}}\\{\text{Kim is in Seoul.}}\\\hline {\text{Therefore, Kim is in South Korea.}}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/98a6cac4e163b2e55cdc1f0a04f903a887c6c55e)|
|_Modus tollens_|P→Q¬Q¬P![{\displaystyle {\begin{array}{l}P\to Q\\\lnot Q\\\hline \lnot P\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/eed3ca267d8992ff5ce99ed6e2144621dc5335f4)|If Koko is a koala, then Koko is cuddly.Koko is not cuddly.Therefore, Koko is not a koala.![{\displaystyle {\begin{array}{l}{\text{If Koko is a koala, then Koko is cuddly.}}\\{\text{Koko is not cuddly.}}\\\hline {\text{Therefore, Koko is not a koala.}}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/5795e4d9307e2d802867bad225b9cc89c8556e33)|
|Hypothetical syllogism|P→QQ→RP→R![{\displaystyle {\begin{array}{l}P\to Q\\Q\to R\\\hline P\to R\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/695ec9fc90a04a1a3ae6a7b075ff220064ca8bfc)|If Leo is a lion, then Leo roars.If Leo roars, then Leo is fierce.Therefore, if Leo is a lion, then Leo is fierce.![{\displaystyle {\begin{array}{l}{\text{If Leo is a lion, then Leo roars.}}\\{\text{If Leo roars, then Leo is fierce.}}\\\hline {\text{Therefore, if Leo is a lion, then Leo is fierce.}}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c637c8dcb79d00229cec749df63ba9115128a605)|
|Disjunctive syllogism|P∨Q¬PQ![{\displaystyle {\begin{array}{l}P\lor Q\\\lnot P\\\hline Q\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/af2f7f23abf689e6658e8edd0eb98f33ef32b8df)|The book is on the shelf or on the table.The book is not on the shelf.Therefore, the book is on the table. ![{\displaystyle {\begin{array}{l}{\text{The book is on the shelf or on the table.}}\\{\text{The book is not on the shelf.}}\\\hline {\text{Therefore, the book is on the table. }}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/36b31c55fb11511aa560b70307d438ca59754ff5)|
|Double negation elimination|¬¬PP![{\displaystyle {\begin{array}{l}\lnot \lnot P\\\hline P\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f8e9958b5b3f8d26bf39c97cf5e0be35c95e5411)|We were not unable to meet the deadline.We were able to meet the deadline. ![{\displaystyle {\begin{array}{l}{\text{We were not unable to meet the deadline.}}\\\hline {\text{We were able to meet the deadline. }}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/cc2195f5664bb8191a1b5609aa53d8567b107062)|

#### First-order logic

Main article: [First-order logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic")

[![Photo of a bronze bust of a bearded man](https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Wismar_Marienkirche_Bronzeb%C3%BCste_Gottlob_Frege_%2801-1%29.JPG/250px-Wismar_Marienkirche_Bronzeb%C3%BCste_Gottlob_Frege_%2801-1%29.JPG)](https://en.wikipedia.org/wiki/File:Wismar_Marienkirche_Bronzeb%C3%BCste_Gottlob_Frege_\(01-1\).JPG)

As one of the founding fathers of modern logic, [Gottlob Frege](https://en.wikipedia.org/wiki/Gottlob_Frege "Gottlob Frege") (1848–1925) explored some of the foundational concepts of first-order logic.[[44]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-55)

First-order logic also employs the logical operators from propositional logic but includes additional devices to articulate the internal structure of propositions. Basic propositions in first-order logic consist of a [predicate](https://en.wikipedia.org/wiki/Predicate_\(logic\) "Predicate (logic)"), symbolized with uppercase letters like P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), which is applied to [singular terms](https://en.wikipedia.org/wiki/Singular_term "Singular term"), symbolized with lowercase letters like a![{\displaystyle a}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ffd2487510aa438433a2579450ab2b3d557e5edc) and b![{\displaystyle b}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f11423fbb2e967f986e36804a8ae4271734917c3). For example, if a![{\displaystyle a}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ffd2487510aa438433a2579450ab2b3d557e5edc) stands for "Aristotle" and P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) stands for "is a philosopher", then the formula P(a)![{\displaystyle P(a)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/87843d318d662e597ebd3c0260bcb2727707009d) means that "Aristotle is a philosopher". Another innovation of first-order logic is the use of the [quantifiers](https://en.wikipedia.org/wiki/Quantifier_\(logic\) "Quantifier (logic)") ∃![{\displaystyle \exists }](https://wikimedia.org/api/rest_v1/media/math/render/svg/77ed842b6b90b2fdd825320cf8e5265fa937b583) and ∀![{\displaystyle \forall }](https://wikimedia.org/api/rest_v1/media/math/render/svg/bfc1a1a9c4c0f8d5df989c98aa2773ed657c5937), which express that a predicate applies to some or all individuals. For instance, the formula ∃xP(x)![{\displaystyle \exists xP(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d4bb6d8a3cf6275a71b7183604aa81e8ba7edb50) expresses that philosophers exist, while ∀xP(x)![{\displaystyle \forall xP(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/25873948fc98344950ea1b91f88dd52239cf9c87) expresses that everyone is a philosopher. The rules of inference from propositional logic are also valid in first-order logic.[[45]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-56) Additionally, first-order logic introduces new rules of inference that govern the role of singular terms, predicates, and quantifiers in arguments. Key rules of inference are [universal instantiation](https://en.wikipedia.org/wiki/Universal_instantiation "Universal instantiation") and [existential generalization](https://en.wikipedia.org/wiki/Existential_generalization "Existential generalization"). Other rules of inference include [universal generalization](https://en.wikipedia.org/wiki/Universal_generalization "Universal generalization") and [existential instantiation](https://en.wikipedia.org/wiki/Existential_instantiation "Existential instantiation").[[10]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto-12)

|   |   |   |
|---|---|---|
Notable rules of inference[[10]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto-12)
|Rule of inference|Form|Example|
|Universal instantiation|∀xP(x)P(a)![{\displaystyle {\begin{array}{l}\forall xP(x)\\\hline P(a)\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8a1c3bf87509a386aecedbe971dfd30c4a3a4033)[[l]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-57)|Everyone must pay taxes.Therefore, Wesley must pay taxes.![{\displaystyle {\begin{array}{l}{\text{Everyone must pay taxes.}}\\\hline {\text{Therefore, Wesley must pay taxes.}}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/4f9548a4543e094886dafe408194088da353384a)|
|Existential generalization|P(a)∃xP(x)![{\displaystyle {\begin{array}{l}P(a)\\\hline \exists xP(x)\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c6b02ddba83823d34359f86edb239a94ed3783bb)|Socrates is mortal.Therefore, someone is mortal.![{\displaystyle {\begin{array}{l}{\text{Socrates is mortal.}}\\\hline {\text{Therefore, someone is mortal.}}\end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/a7f5c61a4f822a06c6f182883ab0b05891843aa4)|

### Modal logics

Main article: [Modal logic](https://en.wikipedia.org/wiki/Modal_logic "Modal logic")

Modal logics are formal systems that extend propositional logic and first-order logic with additional operators. Alethic modal logic introduces the operator ◊![{\displaystyle \Diamond }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1e5e6f31a91de53f443e2cd4c7478693a1a6a57b) to express that something is possible and the operator ◻![{\displaystyle \Box }](https://wikimedia.org/api/rest_v1/media/math/render/svg/029b77f09ebeaf7528fc831fe57848be51f2240b) to express that something is necessary. For example, if P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) means that "Parvati works", then ◊P![{\displaystyle \Diamond P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c11ced51ad343c329a468b33e5139a99306fd0b6) means that "It is possible that Parvati works", while ◻P![{\displaystyle \Box P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d30b6d37f2d650ad3011989f5477df0536bed7d1) means that "It is necessary that Parvati works". These two operators are related by a rule of replacement stating that ◻P![{\displaystyle \Box P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d30b6d37f2d650ad3011989f5477df0536bed7d1) is equivalent to ¬◊¬P![{\displaystyle \lnot \Diamond \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/400eceb8c5cd7e55c7db8082896a98a22b2ff98a). In other words: if something is necessarily true then it is not possible that it is not true. Further rules of inference include the necessitation rule, which asserts that a statement is necessarily true if it is provable in a formal system without any additional premises, and the distribution axiom, which allows one to derive ◊P→◊Q![{\displaystyle \Diamond P\to \Diamond Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd77e06b8a90425c7cbabc58522f16fa6454798e) from ◊(P→Q)![{\displaystyle \Diamond (P\to Q)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/bd51aea81548ba86f2c5f20cc0a8205a76f07df4). These rules of inference belong to system K, a weak form of modal logic with only the most basic rules of inference. Many formal systems of alethic modal logic include additional rules of inference, such as system T, which allows one to deduce P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) from ◻P![{\displaystyle \Box P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d30b6d37f2d650ad3011989f5477df0536bed7d1).[[46]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-58)

Non-alethic systems of modal logic introduce operators that behave like ◊![{\displaystyle \Diamond }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1e5e6f31a91de53f443e2cd4c7478693a1a6a57b) and ◻![{\displaystyle \Box }](https://wikimedia.org/api/rest_v1/media/math/render/svg/029b77f09ebeaf7528fc831fe57848be51f2240b) in alethic modal logic, following similar rules of inference but with different meanings. [Deontic logic](https://en.wikipedia.org/wiki/Deontic_logic "Deontic logic") is one type of non-alethic logic. It uses the operator P![{\displaystyle \mathbf {P} }](https://wikimedia.org/api/rest_v1/media/math/render/svg/c0c250ef2a112c86b93c637dfa288c6d7f34ac3f) to express that an action is permitted and the operator O![{\displaystyle \mathbf {O} }](https://wikimedia.org/api/rest_v1/media/math/render/svg/75f3f92d919fa07d5652bdded0bca40d388b08aa) to express that an action is required, where P![{\displaystyle \mathbf {P} }](https://wikimedia.org/api/rest_v1/media/math/render/svg/c0c250ef2a112c86b93c637dfa288c6d7f34ac3f) behaves similarly to ◊![{\displaystyle \Diamond }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1e5e6f31a91de53f443e2cd4c7478693a1a6a57b) and O![{\displaystyle \mathbf {O} }](https://wikimedia.org/api/rest_v1/media/math/render/svg/75f3f92d919fa07d5652bdded0bca40d388b08aa) behaves similarly to ◻![{\displaystyle \Box }](https://wikimedia.org/api/rest_v1/media/math/render/svg/029b77f09ebeaf7528fc831fe57848be51f2240b). For instance, the rule of replacement in alethic modal logic, which asserts that ◻Q![{\displaystyle \Box Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/5e032c0b0433c2848a394271d11629cd904a8c0b) is equivalent to ¬◊¬Q![{\displaystyle \lnot \Diamond \lnot Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/fdfa1c5a11541e6eb1f3b1dcb128146aaa84f049), also applies to deontic logic. As a result, one can deduce from OQ![{\displaystyle \mathbf {O} Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/6461e44ad721b8801b58f6b880bcd852547a0f42) (e.g., Quinn has an obligation to help) that ¬P¬Q![{\displaystyle \lnot \mathbf {P} \lnot Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/284614dab6317895033f3ddd55da8591fa26766f) (e.g., Quinn is not permitted not to help).[[47]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-59) Other systems of modal logic include [temporal modal logic](https://en.wikipedia.org/wiki/Temporal_logic "Temporal logic"), which has operators for what is always or sometimes the case, as well as [doxastic](https://en.wikipedia.org/wiki/Doxastic_logic "Doxastic logic") and [epistemic modal logics](https://en.wikipedia.org/wiki/Epistemic_modal_logic "Epistemic modal logic"), which have operators for what people believe and know.[[48]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-60)

### Other systems

[![Photo of a marble bust of a bearded man](https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Aristotle_Altemps_Inv8575.jpg/250px-Aristotle_Altemps_Inv8575.jpg)](https://en.wikipedia.org/wiki/File:Aristotle_Altemps_Inv8575.jpg)

The rules of inference in [Aristotle](https://en.wikipedia.org/wiki/Aristotle "Aristotle")'s (384–322 BCE) logic have the form of syllogisms.[[49]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-61)

Many other systems of logic have been proposed.[[50]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-62) In [ancient Greece](https://en.wikipedia.org/wiki/Ancient_Greece "Ancient Greece"), one of the earliest systems was [Aristotelian logic](https://en.wikipedia.org/wiki/Aristotelian_logic "Aristotelian logic"), according to which each statement is made up of two [terms](https://en.wikipedia.org/wiki/Term_logic "Term logic"), a subject and a predicate, connected by a [copula](https://en.wikipedia.org/wiki/Copula_\(linguistics\) "Copula (linguistics)"). For example, the statement "all humans are mortal" has the subject "all humans", the predicate "mortal", and the copula "is". All rules of inference in Aristotelian logic have the form of [syllogisms](https://en.wikipedia.org/wiki/Syllogism "Syllogism"), which consist of two premises and a conclusion. For instance, the _Barbara_ rule of inference describes the validity of arguments of the form "All men are mortal. All Greeks are men. Therefore, all Greeks are mortal."[[51]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-63) The [Nyaya](https://en.wikipedia.org/wiki/Nyaya "Nyaya") school in [ancient India](https://en.wikipedia.org/wiki/Ancient_India "Ancient India") also explored rules of inference in the form of syllogisms, such as the argument "All things which have smoke have fire. This hill has smoke. Therefore, this hill has fire."[[52]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-64)

[Second-order logic](https://en.wikipedia.org/wiki/Second-order_logic "Second-order logic") extends first-order logic by allowing quantifiers to apply to predicates in addition to singular terms. For example, to express that the individuals Adam (a![{\displaystyle a}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ffd2487510aa438433a2579450ab2b3d557e5edc)) and Bianca (b![{\displaystyle b}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f11423fbb2e967f986e36804a8ae4271734917c3)) share a property, one can use the formula ∃X(X(a)∧X(b))![{\displaystyle \exists X(X(a)\land X(b))}](https://wikimedia.org/api/rest_v1/media/math/render/svg/358795bbd18d5a641149c12174c6d1fd9b9d6ec7).[[53]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-65) Second-order logic also comes with new rules of inference.[[m]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-67) For instance, one can infer P(a)![{\displaystyle P(a)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/87843d318d662e597ebd3c0260bcb2727707009d) (Adam is a philosopher) from ∀XX(a)![{\displaystyle \forall XX(a)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d3388cbdef611751746929b35f16caa6010aca9c) (every property applies to Adam).[[55]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-68)

[Intuitionistic logic](https://en.wikipedia.org/wiki/Intuitionistic_logic "Intuitionistic logic") is a non-classical variant of propositional and first-order logic. It shares with them many rules of inference, such as _modus ponens_, but excludes certain rules. For example, in classical logic, one can infer P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) from ¬¬P![{\displaystyle \lnot \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/dd7b2854acecb0e4c6656bb881edc564cb441668) using the rule of double negation elimination. However, in intuitionistic logic, this inference is invalid. As a result, every theorem that can be deduced in intuitionistic logic can also be deduced in classical logic, but some theorems provable in classical logic cannot be proven in intuitionistic logic.[[56]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-69) One motivation for this modification is the idea that proofs should demonstrate that an object exists or can be [constructed](https://en.wikipedia.org/wiki/Constructive_proof "Constructive proof"), not merely that its nonexistence would lead to a contradiction.[[57]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-70)

[Paraconsistent logics](https://en.wikipedia.org/wiki/Paraconsistent_logics "Paraconsistent logics") revise classical logic to allow the existence of [contradictions](https://en.wikipedia.org/wiki/Contradiction_\(logic\) "Contradiction (logic)"). In logic, a contradiction happens if the same proposition is both affirmed and denied, meaning that a formal system contains both P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and ¬P![{\displaystyle \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/38a32afb77c17696c41588f6deaf9bcd7109b10c) as theorems. Classical logic prohibits contradictions because classical rules of inference bring with them the [principle of explosion](https://en.wikipedia.org/wiki/Principle_of_explosion "Principle of explosion"), an admissible rule of inference that makes it possible to infer Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed) from the premises P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and ¬P![{\displaystyle \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/38a32afb77c17696c41588f6deaf9bcd7109b10c). Since Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed) is unrelated to P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a), any arbitrary statement can be deduced from a contradiction, making the affected systems useless for deciding what is true and false.[[58]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-71)[[n]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-73) Paraconsistent logics solve this problem by modifying the rules of inference in such a way that the principle of explosion is not an admissible rule of inference. As a result, it is possible to reason about inconsistent information without deriving absurd conclusions.[[60]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-74)

[Many-valued logics](https://en.wikipedia.org/wiki/Many-valued_logics "Many-valued logics") modify classical logic by introducing additional truth values. In classical logic, a proposition is either true or false with nothing in between. In many-valued logics, some propositions are neither true nor false. [Kleene logic](https://en.wikipedia.org/wiki/Kleene_logic "Kleene logic"), for example, is a [three-valued logic](https://en.wikipedia.org/wiki/Three-valued_logic "Three-valued logic") that introduces the additional truth value _undefined_ to describe situations where information is incomplete or uncertain.[[61]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-75) Many-valued logics have adjusted rules of inference to accommodate the additional truth values. For instance, the classical rule of replacement stating that P→Q![{\displaystyle P\to Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d7cad5b2c2991ae1dbded560c5d875fbf49fe8ea) is equivalent to ¬P∨Q![{\displaystyle \lnot P\lor Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/0f6f440ca8c9d6e291a726287d9cb163f5b854de) is invalid in many three-valued systems.[[62]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-76) Some many-valued logics take the form of [probability logics](https://en.wikipedia.org/wiki/Probabilistic_logic "Probabilistic logic"), which make it possible to reason from uncertain information to [probabilistic](https://en.wikipedia.org/wiki/Probability "Probability") conclusions.[[63]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-77)

## Formalisms

Various formalisms or [proof systems](https://en.wikipedia.org/wiki/Proof_system "Proof system") have been suggested as distinct ways of codifying reasoning and demonstrating the validity of arguments. Unlike different systems of logic, these formalisms do not impact what can be proven; they only influence how proofs are formulated. Influential frameworks include [natural deduction](https://en.wikipedia.org/wiki/Natural_deduction "Natural deduction") systems, [Hilbert systems](https://en.wikipedia.org/wiki/Hilbert_systems "Hilbert systems"), and [sequent calculi](https://en.wikipedia.org/wiki/Sequent_calculi "Sequent calculi").[[64]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-78)

Natural deduction systems aim to reflect how people naturally reason by introducing many intuitive rules of inference to make logical derivations more accessible. They break complex arguments into simple steps, often using subproofs based on temporary premises. The rules of inference in natural deduction target specific logical operators, governing how an operator can be added with introduction rules or removed with elimination rules. For example, the rule of [conjunction introduction](https://en.wikipedia.org/wiki/Conjunction_introduction "Conjunction introduction") asserts that one can infer P∧Q![{\displaystyle P\land Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c5690bb4822d8c821a00cfe3c6644b046a884af4) from the premises P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), thereby producing a conclusion with the conjunction operator from premises that do not contain it. Conversely, the rule of [conjunction elimination](https://en.wikipedia.org/wiki/Conjunction_elimination "Conjunction elimination") asserts that one can infer P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) from P∧Q![{\displaystyle P\land Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c5690bb4822d8c821a00cfe3c6644b046a884af4), thereby producing a conclusion that no longer includes the conjunction operator. Similar rules of inference are [disjunction introduction](https://en.wikipedia.org/wiki/Disjunction_introduction "Disjunction introduction") and [elimination](https://en.wikipedia.org/wiki/Disjunction_elimination "Disjunction elimination"), [implication introduction](https://en.wikipedia.org/wiki/Implication_introduction "Implication introduction") and [elimination](https://en.wikipedia.org/wiki/Implication_elimination "Implication elimination"), [negation introduction](https://en.wikipedia.org/wiki/Negation_introduction "Negation introduction") and [elimination](https://en.wikipedia.org/wiki/Negation_elimination "Negation elimination"), and [biconditional introduction](https://en.wikipedia.org/wiki/Biconditional_introduction "Biconditional introduction") and [elimination](https://en.wikipedia.org/wiki/Biconditional_elimination "Biconditional elimination"). As a result, systems of natural deduction usually include many rules of inference.[[65]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-79)[[o]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-81)

Hilbert systems, by contrast, aim to provide a minimal and efficient framework of logical reasoning by including as few rules of inference as possible. Many Hilbert systems only have _modus ponens_ as the sole rule of inference. To ensure that all theorems can be deduced from this minimal foundation, they introduce [axiom schemes](https://en.wikipedia.org/wiki/Axiom_schema "Axiom schema").[[67]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-82) An axiom scheme is a template to create axioms or true statements. It uses metavariables—placeholders that can be replaced by specific terms or formulas to generate an infinite number of true statements.[[68]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-83) For example, propositional logic can be defined with the following three axiom schemes: (1) P→(Q→P)![{\displaystyle P\to (Q\to P)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/bf7d3b4a9db9df7589be6f12c6f6da1974b05f77), (2) (P→(Q→R))→((P→Q)→(P→R))![{\displaystyle (P\to (Q\to R))\to ((P\to Q)\to (P\to R))}](https://wikimedia.org/api/rest_v1/media/math/render/svg/881cd7109256a460b4b78ab25623fa607026e399), and (3) (¬P→¬Q)→(Q→P)![{\displaystyle (\lnot P\to \lnot Q)\to (Q\to P)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/47d7e7b6665b53ff47ba03e476368fac87672539).[[69]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-84) To formulate proofs, logicians create new statements from axiom schemes and then apply _modus ponens_ to these statements to derive conclusions. Compared to natural deduction, this procedure tends to be less intuitive since its heavy reliance on symbolic manipulation can obscure the underlying logical reasoning.[[70]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-85)

Sequent calculi, another approach, introduce [sequents](https://en.wikipedia.org/wiki/Sequent "Sequent") as formal representations of arguments. A sequent has the form A1,…,Am⊢B1,…,Bn![{\displaystyle A_{1},\dots ,A_{m}\vdash B_{1},\dots ,B_{n}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7924eeb4b277544a51744f5f0981be150a27b363), where Ai![{\displaystyle A_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/1aed3b5def921afbe6cc48aaf8f9b11c6f1c1e2d) and Bi![{\displaystyle B_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/82cda0578ec6b48774c541ecb9bee4a90176e62f) stand for propositions. Sequents are conditional assertions stating that at least one Bi![{\displaystyle B_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/82cda0578ec6b48774c541ecb9bee4a90176e62f) is true if all Ai![{\displaystyle A_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/1aed3b5def921afbe6cc48aaf8f9b11c6f1c1e2d) are true. Rules of inference operate on sequents to produce additional sequents. Sequent calculi define two rules of inference for each logical operator: one to introduce it on the left side of a sequent and another to introduce it on the right side. For example, through the rule for introducing the operator ¬![{\displaystyle \lnot }](https://wikimedia.org/api/rest_v1/media/math/render/svg/099107443792f5fec9bebe39b919a690db7198c1) on the left side, one can infer ¬R,P⊢Q![{\displaystyle \lnot R,P\vdash Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/fdd5f677c99ea58ee0a8cd7fa44475405d4c791d) from P⊢Q,R![{\displaystyle P\vdash Q,R}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d6c95693712d7581d2d3d7cff39a2fe878516b06). The [cut rule](https://en.wikipedia.org/wiki/Cut_rule "Cut rule"), an additional rule of inference, makes it possible to simplify sequents by removing certain propositions.[[71]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-86)

## Formal fallacies

Main article: [Formal fallacy](https://en.wikipedia.org/wiki/Formal_fallacy "Formal fallacy")

[![Diagram of modus ponens and affirming the consequent](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Modus_ponens_%26_affirming_the_consequent.svg/250px-Modus_ponens_%26_affirming_the_consequent.svg.png)](https://en.wikipedia.org/wiki/File:Modus_ponens_%26_affirming_the_consequent.svg)

[Affirming the consequent](https://en.wikipedia.org/wiki/Affirming_the_consequent "Affirming the consequent") is a formal fallacy that resembles the valid rule of inference _modus ponens_.[[72]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto1-87)

While rules of inference describe valid patterns of deductive reasoning, formal fallacies are invalid argument forms that involve [logical errors](https://en.wikipedia.org/wiki/Fallacy "Fallacy"). The premises of a formal fallacy do not properly support its conclusion: the conclusion can be false even if all premises are true. Formal fallacies often mimic the structure of valid rules of inference and can thereby mislead people into unknowingly committing them and accepting their conclusions.[[73]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-88)

The formal fallacy of [affirming the consequent](https://en.wikipedia.org/wiki/Affirming_the_consequent "Affirming the consequent") concludes P![{\displaystyle P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/b4dc73bf40314945ff376bd363916a738548d40a) from the premises P→Q![{\displaystyle P\to Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d7cad5b2c2991ae1dbded560c5d875fbf49fe8ea) and Q![{\displaystyle Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/8752c7023b4b3286800fe3238271bbca681219ed), as in the argument "If Leo is a cat, then Leo is an animal. Leo is an animal. Therefore, Leo is a cat." This fallacy resembles valid inferences following _modus ponens_, with the key difference that the fallacy swaps the second premise and the conclusion.[[72]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-auto1-87) The formal fallacy of [denying the antecedent](https://en.wikipedia.org/wiki/Denying_the_antecedent "Denying the antecedent") concludes ¬Q![{\displaystyle \lnot Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/67b5e3033d1f0e7333fc9e708c2ea802f9b9fca9) from the premises P→Q![{\displaystyle P\to Q}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d7cad5b2c2991ae1dbded560c5d875fbf49fe8ea) and ¬P![{\displaystyle \lnot P}](https://wikimedia.org/api/rest_v1/media/math/render/svg/38a32afb77c17696c41588f6deaf9bcd7109b10c), as in the argument "If Laya saw the movie, then Laya had fun. Laya did not see the movie. Therefore, Laya did not have fun." This fallacy resembles valid inferences following _modus tollens_, with the key difference that the fallacy swaps the second premise and the conclusion.[[74]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-89) Other formal fallacies include [affirming a disjunct](https://en.wikipedia.org/wiki/Affirming_a_disjunct "Affirming a disjunct"), the [existential fallacy](https://en.wikipedia.org/wiki/Existential_fallacy "Existential fallacy"), and the [fallacy of the undistributed middle](https://en.wikipedia.org/wiki/Fallacy_of_the_undistributed_middle "Fallacy of the undistributed middle").[[75]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-90)

## In various fields

Rules of inference are relevant to many fields, especially the [formal sciences](https://en.wikipedia.org/wiki/Formal_science "Formal science"), such as [mathematics](https://en.wikipedia.org/wiki/Mathematics "Mathematics") and [computer science](https://en.wikipedia.org/wiki/Computer_science "Computer science"), where they are used to prove theorems.[[76]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-91) [Mathematical proofs](https://en.wikipedia.org/wiki/Mathematical_proofs "Mathematical proofs") often start with a set of axioms to describe the logical relationships between mathematical constructs. To establish theorems, mathematicians apply rules of inference to these axioms, aiming to demonstrate that the theorems are logical consequences.[[77]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-92) They distinguish various [types of proof](https://en.wikipedia.org/wiki/Mathematical_proof "Mathematical proof") based on the inferential strategy to arrive at a conclusion such as [direct proof](https://en.wikipedia.org/wiki/Direct_proof "Direct proof"), [proof by contradiction](https://en.wikipedia.org/wiki/Proof_by_contradiction "Proof by contradiction"), and [mathematical induction](https://en.wikipedia.org/wiki/Mathematical_induction "Mathematical induction").[[78]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-93) [Mathematical logic](https://en.wikipedia.org/wiki/Mathematical_logic "Mathematical logic"), a subfield of mathematics and logic, uses mathematical methods and frameworks to study rules of inference and other logical concepts.[[79]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-94)

Computer science also relies on deductive reasoning, employing rules of inference to establish theorems and validate [algorithms](https://en.wikipedia.org/wiki/Algorithms "Algorithms").[[80]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-95) [Logic programming](https://en.wikipedia.org/wiki/Logic_programming "Logic programming") frameworks, such as [Prolog](https://en.wikipedia.org/wiki/Prolog "Prolog"), allow developers to [represent knowledge](https://en.wikipedia.org/wiki/Knowledge_representation "Knowledge representation") and use [computation](https://en.wikipedia.org/wiki/Computation "Computation") to draw inferences and solve problems.[[81]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-96) These frameworks often include an [automated theorem prover](https://en.wikipedia.org/wiki/Automated_theorem_prover "Automated theorem prover"), a program that uses rules of inference to generate or verify proofs automatically.[[82]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-97) [Expert systems](https://en.wikipedia.org/wiki/Expert_system "Expert system") utilize [automated reasoning](https://en.wikipedia.org/wiki/Automated_reasoning "Automated reasoning") to simulate the [decision-making](https://en.wikipedia.org/wiki/Decision-making "Decision-making") processes of human [experts](https://en.wikipedia.org/wiki/Experts "Experts") in specific fields, such as [medical diagnosis](https://en.wikipedia.org/wiki/Medical_diagnosis "Medical diagnosis"), and assist in complex problem-solving tasks. They have a [knowledge base](https://en.wikipedia.org/wiki/Knowledge_base "Knowledge base") to represent the facts and rules of the field and use an [inference engine](https://en.wikipedia.org/wiki/Inference_engine "Inference engine") to extract relevant information and respond to user queries.[[83]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-98)

Rules of inference are central to the [philosophy of logic](https://en.wikipedia.org/wiki/Philosophy_of_logic "Philosophy of logic") regarding the definition of [logical consequence](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence"), which describes the [relation](https://en.wikipedia.org/wiki/Relation_\(philosophy\) "Relation (philosophy)") between the premises of a deductively valid argument and its conclusion. Different theories of this concept debate its nature and the conditions under which it exists. According to the deductive-theoretic conception, logical consequence is defined in terms of rules of inference: a conclusion follows logically from a set of premises if it can be deduced through a series of inferential steps. The [model-theoretic](https://en.wikipedia.org/wiki/Model_theory "Model theory") conception, by contrast, focuses on how the non-logical vocabulary of statements can be [interpreted](https://en.wikipedia.org/wiki/Interpretation_\(logic\) "Interpretation (logic)"). According to this view, logical consequence means that no counterexamples are possible: under no interpretation are the premises true and the conclusion false.[[84]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-99) A related topic in the [epistemology of logic](https://en.wikipedia.org/wiki/Epistemology_of_logic "Epistemology of logic") concerns the question of how to justify that _modus ponens_ and other rules of inference are acceptable forms of correct reasoning.[[85]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-100)

[Cognitive psychologists](https://en.wikipedia.org/wiki/Cognitive_psychology "Cognitive psychology") study mental processes, including [logical reasoning](https://en.wikipedia.org/wiki/Logical_reasoning "Logical reasoning"). They are interested in how humans use rules of inference to draw conclusions, examining the factors that influence correctness and efficiency. They observe, for example, that people are better at using _modus ponens_ than _modus tollens_, resulting in a higher rate of successful inferences. A related topic focuses on [biases](https://en.wikipedia.org/wiki/Cognitive_bias "Cognitive bias") that lead individuals to mistake formal fallacies for valid arguments. For instance, fallacies of the types affirming the consequent and denying the antecedent are often mistakenly accepted as valid. The assessment of arguments also depends on the concrete meaning of the propositions: individuals are more likely to accept a fallacy if its conclusion sounds plausible.[[86]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-101)

Rules of inference are also relevant to the field of [law](https://en.wikipedia.org/wiki/Law "Law") for establishing the validity of one's argument or undermining the opponent's case by exposing logical fallacies. However, legal reasoning is not limited to strict deductive inferences, incorporating aspects such as [legal norms](https://en.wikipedia.org/wiki/Legal_norms "Legal norms") and [evidentiary standards](https://en.wikipedia.org/wiki/Evidentiary_standard "Evidentiary standard") that go beyond pure formal logic.[[87]](https://en.wikipedia.org/wiki/Rule_of_inference#cite_note-102)

## See also

- [Immediate inference](https://en.wikipedia.org/wiki/Immediate_inference "Immediate inference") – Logical inference from a single statement
- [Inference objection](https://en.wikipedia.org/wiki/Inference_objection "Inference objection") – Rejection of an argument challenging the relationship between premises and conclusion
- [Laws of thought](https://en.wikipedia.org/wiki/Laws_of_thought "Laws of thought") – Logical principles
- [List of rules of inference](https://en.wikipedia.org/wiki/List_of_rules_of_inference "List of rules of inference")
- [Structural rule](https://en.wikipedia.org/wiki/Structural_rule "Structural rule") – Rule of mathematical logic

## References

---

A **syllogism** ([Ancient Greek](https://en.wikipedia.org/wiki/Ancient_Greek_language "Ancient Greek language"): συλλογισμός, _syllogismos_, 'conclusion, inference') is a kind of [logical argument](https://en.wikipedia.org/wiki/Argument "Argument") that applies [deductive reasoning](https://en.wikipedia.org/wiki/Deductive_reasoning "Deductive reasoning") to arrive at a [conclusion](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence") based on two [propositions](https://en.wikipedia.org/wiki/Proposition "Proposition") that are asserted or assumed to be true.

In its earliest form (defined by [Aristotle](https://en.wikipedia.org/wiki/Aristotle "Aristotle") in his 350 BC book _[Prior Analytics](https://en.wikipedia.org/wiki/Prior_Analytics "Prior Analytics")_), a deductive syllogism arises when two true premises (propositions or statements) validly imply a conclusion, or the main point that the argument aims to get across.[[1]](https://en.wikipedia.org/wiki/Syllogism#cite_note-1) For example, knowing that all men are mortal (major premise), and that [Socrates](https://en.wikipedia.org/wiki/Socrates "Socrates") is a man (minor premise), we may validly conclude that Socrates is mortal. Syllogistic arguments are usually represented in a three-line form:

> All men are mortal.  
> Socrates is a man.  
> Therefore, Socrates is mortal.[[2]](https://en.wikipedia.org/wiki/Syllogism#cite_note-2)

In antiquity, two rival syllogistic theories existed: [Aristotelian syllogism](https://en.wikipedia.org/wiki/Term_logic "Term logic") and [Stoic syllogism](https://en.wikipedia.org/wiki/Stoic_logic "Stoic logic").[[3]](https://en.wikipedia.org/wiki/Syllogism#cite_note-:0-3) From the [Middle Ages](https://en.wikipedia.org/wiki/Middle_Ages "Middle Ages") onwards, _categorical syllogism_ and _syllogism_ were usually used interchangeably. This article is concerned only with this historical use. The syllogism was at the core of historical deductive reasoning, whereby facts are determined by combining existing statements, in contrast to [inductive reasoning](https://en.wikipedia.org/wiki/Inductive_reasoning "Inductive reasoning"), in which facts are predicted by repeated observations.

Within some academic contexts, syllogism has been superseded by [first-order predicate logic](https://en.wikipedia.org/wiki/First-order_logic "First-order logic") following the work of [Gottlob Frege](https://en.wikipedia.org/wiki/Gottlob_Frege "Gottlob Frege"), in particular his _[Begriffsschrift](https://en.wikipedia.org/wiki/Begriffsschrift "Begriffsschrift")_ (_Concept Script_; 1879). Syllogism, being a method of valid logical reasoning, will always be useful in most circumstances, and for general-audience introductions to logic and clear-thinking.[[4]](https://en.wikipedia.org/wiki/Syllogism#cite_note-4)[[5]](https://en.wikipedia.org/wiki/Syllogism#cite_note-5)

## Early history

Main article: [History of logic](https://en.wikipedia.org/wiki/History_of_logic "History of logic")

|   |   |
|---|---|
|[![[icon]](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Wiki_letter_w_cropped.svg/20px-Wiki_letter_w_cropped.svg.png)](https://en.wikipedia.org/wiki/File:Wiki_letter_w_cropped.svg)|This section **needs expansion**. You can help by [adding missing information](https://en.wikipedia.org/w/index.php?title=Syllogism&action=edit&section=). _(September 2025)_|

In antiquity, two rival syllogistic theories existed: Aristotelian syllogism and Stoic syllogism.[[3]](https://en.wikipedia.org/wiki/Syllogism#cite_note-:0-3)

### Aristotle

Main article: [Term logic](https://en.wikipedia.org/wiki/Term_logic "Term logic")

[Aristotle](https://en.wikipedia.org/wiki/Aristotle "Aristotle") defines the syllogism as

> "a discourse in which certain (specific) things having been supposed, something different from the things supposed results of necessity because these things are so."[[6]](https://en.wikipedia.org/wiki/Syllogism#cite_note-6)

Despite this very general definition, in _[Prior Analytics](https://en.wikipedia.org/wiki/Prior_Analytics "Prior Analytics")_ Aristotle limits himself to categorical syllogisms that consist of three [categorical propositions](https://en.wikipedia.org/wiki/Categorical_proposition "Categorical proposition"), including categorical [modal](https://en.wikipedia.org/wiki/Modal_logic "Modal logic") syllogisms.[[7]](https://en.wikipedia.org/wiki/Syllogism#cite_note-7)

The use of syllogisms as a tool for understanding can be dated back to the logical reasoning discussions of [Aristotle](https://en.wikipedia.org/wiki/Aristotle "Aristotle"). Before the mid-12th century, medieval logicians were only familiar with a portion of Aristotle's works, including such titles as _[Categories](https://en.wikipedia.org/wiki/Categories_\(Aristotle\) "Categories (Aristotle)")_ and _[On Interpretation](https://en.wikipedia.org/wiki/On_Interpretation "On Interpretation")_, works that contributed heavily to the prevailing Old Logic, or _[logica vetus](https://en.wikipedia.org/wiki/Logica_vetus "Logica vetus")_. The onset of a New Logic, or _[logica nova](https://en.wikipedia.org/wiki/Logica_nova "Logica nova")_, arose alongside the reappearance of _Prior Analytics_, the work in which Aristotle developed his theory of the syllogism.

_Prior Analytics_, upon rediscovery, was instantly regarded by logicians as "a closed and complete body of doctrine", leaving very little for thinkers of the day to debate, and reorganize. Aristotle's theory on the syllogism for _[assertoric](https://en.wikipedia.org/wiki/Assertoric "Assertoric")_ sentences was considered especially remarkable, with only small systematic changes occurring to the concept over time. This theory of the syllogism would not enter the context of the more comprehensive logic of consequence until logic began to be reworked in general in the mid-14th century by the likes of [John Buridan](https://en.wikipedia.org/wiki/John_Buridan "John Buridan").

Aristotle's _Prior Analytics_ did not, however, incorporate such a comprehensive theory on the modal syllogism—a syllogism that has at least one [modalized](https://en.wikipedia.org/wiki/Modal_logic "Modal logic") premise, that is, a premise containing the modal words _necessarily_, _possibly_, or _contingently_. Aristotle's terminology in this aspect of his theory was deemed vague, and in many cases unclear, even contradicting some of his statements from _On Interpretation_. His original assertions on this specific component of the theory were left up to a considerable amount of conversation, resulting in a wide array of solutions put forth by commentators of the day. The system for modal syllogisms laid forth by Aristotle would ultimately be deemed unfit for practical use, and would be replaced by new distinctions and new theories altogether.

### Medieval syllogism

#### Boethius

[Boethius](https://en.wikipedia.org/wiki/Boethius "Boethius") (c. 475–526) contributed an effort to make the ancient Aristotelian logic more accessible. While his Latin translation of _[Prior Analytics](https://en.wikipedia.org/wiki/Prior_Analytics "Prior Analytics")_ went primarily unused before the 12th century, his textbooks on the categorical syllogism were central to expanding the syllogistic discussion. Rather than in any additions that he personally made to the field, Boethius' logical legacy lies in his effective transmission of prior theories to later logicians, as well as his clear and primarily accurate presentations of Aristotle's contributions.

#### Peter Abelard

Another of medieval logic's first contributors from the Latin West, [Peter Abelard](https://en.wikipedia.org/wiki/Peter_Abelard "Peter Abelard") (1079–1142), gave his own thorough evaluation of the syllogism concept, and accompanying theory in the _Dialectica_—a discussion of logic based on Boethius' commentaries and monographs. His perspective on syllogisms can be found in other works as well, such as _Logica Ingredientibus_. With the help of Abelard's distinction between _[de dicto](https://en.wikipedia.org/wiki/De_dicto "De dicto")_ modal sentences and _[de re](https://en.wikipedia.org/wiki/De_re "De re")_ modal sentences, medieval logicians began to shape a more coherent concept of Aristotle's modal syllogism model.

#### Jean Buridan

The French philosopher [Jean Buridan](https://en.wikipedia.org/wiki/Jean_Buridan "Jean Buridan") (c. 1300 – 1361), whom some consider the foremost logician of the later Middle Ages, contributed two significant works: _Treatise on Consequence_ and _Summulae de Dialectica_, in which he discussed the concept of the syllogism, its components and distinctions, and ways to use the tool to expand its logical capability. For 200 years after Buridan's discussions, little was said about syllogistic logic. Historians of logic have assessed that the primary changes in the post-Middle Age era were changes in respect to the public's awareness of original sources, a lessening of appreciation for the logic's sophistication and complexity, and an increase in logical ignorance—so that logicians of the early 20th century came to view the whole system as ridiculous.[[8]](https://en.wikipedia.org/wiki/Syllogism#cite_note-8)

## Modern history

The Aristotelian syllogism dominated Western philosophical thought for many centuries. Syllogism itself is about drawing valid conclusions from assumptions ([axioms](https://en.wikipedia.org/wiki/Axiom "Axiom")), rather than about verifying the assumptions. However, people over time focused on the logic aspect, forgetting the importance of verifying the assumptions.

In the 17th century, [Francis Bacon](https://en.wikipedia.org/wiki/Francis_Bacon "Francis Bacon") emphasized that experimental verification of axioms must be carried out rigorously, and cannot take syllogism itself as the best way to draw conclusions in nature.[[9]](https://en.wikipedia.org/wiki/Syllogism#cite_note-instauration-9) Bacon proposed a more inductive approach to the observation of nature, which involves experimentation, and leads to discovering and building on axioms to create a more general conclusion.[[9]](https://en.wikipedia.org/wiki/Syllogism#cite_note-instauration-9) Yet, a full method of drawing conclusions in nature is not the scope of logic or syllogism, and the inductive method was covered in Aristotle's subsequent treatise, the _[Posterior Analytics](https://en.wikipedia.org/wiki/Posterior_Analytics "Posterior Analytics")_.

In the 19th century, modifications to syllogism were incorporated to deal with [disjunctive](https://en.wikipedia.org/wiki/Disjunctive_syllogism "Disjunctive syllogism") ("A or B") and [conditional](https://en.wikipedia.org/wiki/Conditional_syllogism "Conditional syllogism") ("if A then B") statements. [Immanuel Kant](https://en.wikipedia.org/wiki/Immanuel_Kant "Immanuel Kant") famously claimed, in _Logic_ (1800), that logic was the one completed science, and that Aristotelian logic more or less included everything about logic that there was to know. (This work is not necessarily representative of Kant's mature philosophy, which is often regarded as an innovation to logic itself.) Kant's opinion stood unchallenged in the West until 1879, when [Gottlob Frege](https://en.wikipedia.org/wiki/Gottlob_Frege "Gottlob Frege") published his _[Begriffsschrift](https://en.wikipedia.org/wiki/Begriffsschrift "Begriffsschrift")_ (_Concept Script_). This introduced a calculus, a method of representing categorical statements (and statements that are not provided for in syllogism as well) by the use of quantifiers and variables.

A noteworthy exception is the logic developed in [Bernard Bolzano](https://en.wikipedia.org/wiki/Bernard_Bolzano "Bernard Bolzano")'s work _[Wissenschaftslehre](https://en.wikipedia.org/wiki/Bernard_Bolzano#Wissenschaftslehre_\(Theory_of_Science\) "Bernard Bolzano")_ (_Theory of Science_, 1837), the principles of which were applied as a direct critique of Kant, in the posthumously published work _New Anti-Kant_ (1850). The work of Bolzano had been largely overlooked until the late 20th century, among other reasons, because of the intellectual environment at the time in [Bohemia](https://en.wikipedia.org/wiki/Bohemia "Bohemia"), which was then part of the [Austrian Empire](https://en.wikipedia.org/wiki/Austrian_Empire "Austrian Empire"). In the last 20 years, Bolzano's work has resurfaced and become subject of both translation and contemporary study.

One notable exception to this modern relegation is the continued application of Aristotelian logic by officials of the [Congregation for the Doctrine of the Faith](https://en.wikipedia.org/wiki/Congregation_for_the_Doctrine_of_the_Faith "Congregation for the Doctrine of the Faith"), and the Apostolic Tribunal of the [Roman Rota](https://en.wikipedia.org/wiki/Roman_Rota "Roman Rota"), which still requires that any arguments crafted by Advocates be presented in syllogistic format.

### Boole's acceptance of Aristotle

[George Boole](https://en.wikipedia.org/wiki/George_Boole "George Boole")'s unwavering acceptance of Aristotle's logic is emphasized by the historian of logic [John Corcoran](https://en.wikipedia.org/wiki/John_Corcoran_\(logician\) "John Corcoran (logician)") in an accessible introduction to _[Laws of Thought](https://en.wikipedia.org/wiki/Laws_of_Thought "Laws of Thought")_.[[10]](https://en.wikipedia.org/wiki/Syllogism#cite_note-10)[[11]](https://en.wikipedia.org/wiki/Syllogism#cite_note-11) Corcoran also wrote a point-by-point comparison of _[Prior Analytics](https://en.wikipedia.org/wiki/Prior_Analytics "Prior Analytics")_ and _[Laws of Thought](https://en.wikipedia.org/wiki/The_Laws_of_Thought "The Laws of Thought")_.[[12]](https://en.wikipedia.org/wiki/Syllogism#cite_note-:1-12) According to Corcoran, Boole fully accepted and endorsed Aristotle's logic. Boole's goals were "to go under, over, and beyond" Aristotle's logic by:[[12]](https://en.wikipedia.org/wiki/Syllogism#cite_note-:1-12)

1. providing it with mathematical foundations involving equations;
2. extending the class of problems it could treat, as solving equations was added to assessing [validity](https://en.wikipedia.org/wiki/Validity_\(logic\) "Validity (logic)"); and
3. expanding the range of applications it could handle, such as expanding propositions of only two terms to those having arbitrarily many.

More specifically, Boole agreed with what [Aristotle](https://en.wikipedia.org/wiki/Aristotle "Aristotle") said; Boole's 'disagreements', if they might be called that, concern what Aristotle did not say. First, in the realm of foundations, Boole reduced Aristotle's four propositional forms to one form, the form of equations, which by itself was a revolutionary idea. Second, in the realm of logic's problems, Boole's addition of equation solving to logic—another revolutionary idea—involved Boole's doctrine that Aristotle's rules of inference (the "perfect syllogisms") must be supplemented by rules for equation solving. Third, in the realm of applications, Boole's system could handle multi-term propositions and arguments, whereas Aristotle could handle only two-termed subject-predicate propositions and arguments. For example, Aristotle's system could not deduce: "No quadrangle that is a square is a rectangle that is a rhombus" from "No square that is a quadrangle is a rhombus that is a rectangle" or from "No rhombus that is a rectangle is a square that is a quadrangle."

## Basic structure

A categorical syllogism consists of three parts:

1. Major premise
2. Minor premise
3. Conclusion/Consequent

Each part is a [categorical proposition](https://en.wikipedia.org/wiki/Categorical_proposition "Categorical proposition"), and each categorical proposition contains two categorical terms.[[13]](https://en.wikipedia.org/wiki/Syllogism#cite_note-13) In Aristotle, each of the premises is in the form "All S are P," "Some S are P", "No S are P" or "Some S are not P", where "S" is the subject-term and "P" is the predicate-term:

- "All S are P," and "No S are P" are termed [_universal_ propositions](https://en.wikipedia.org/wiki/Universal_proposition "Universal proposition");
- "Some S are P" and "Some S are not P" are termed [_particular_ propositions](https://en.wikipedia.org/wiki/Particular_proposition "Particular proposition").

More modern logicians allow some variation. Each of the premises has one term in common with the conclusion: in a major premise, this is the _major term_ (i.e., the [predicate](https://en.wikipedia.org/wiki/Predicate_\(grammar\) "Predicate (grammar)") of the conclusion); in a minor premise, this is the _minor term_ (i.e., the subject of the conclusion). For example:

**Major premise**: All humans are mortal.

**Minor premise**: All Greeks are humans.

**Conclusion/Consequent**: All Greeks are mortal.

Each of the three distinct terms represents a category. From the example above, _humans_, _mortal_, and _Greeks_: _mortal_ is the major term, and _Greeks_ the minor term. The premises also have one term in common with each other, which is known as the _middle term_; in this example, _humans_. Both of the premises are universal, as is the conclusion.

**Major premise**: All mortals die.

**Minor premise**: All men are mortals.

**Conclusion/Consequent**: All men die.

Here, the major term is _die_, the minor term is _men_, and the middle term is _mortals_. Again, both premises are universal, hence so is the conclusion.

### Polysyllogism

Main article: [Polysyllogism](https://en.wikipedia.org/wiki/Polysyllogism "Polysyllogism")

A polysyllogism, or a **sorites**, is a form of argument in which a series of incomplete syllogisms is so arranged that the predicate of each premise forms the subject of the next until the subject of the first is joined with the predicate of the last in the conclusion. For example, one might argue that all lions are big cats, all big cats are predators, and all predators are carnivores. To conclude that therefore all lions are carnivores is to construct a sorites argument.

## Types

|   |   |
|---|---|
|![](https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png)|This section **may contain [original research](https://en.wikipedia.org/wiki/Wikipedia:No_original_research "Wikipedia:No original research")**. Please [improve it](https://en.wikipedia.org/w/index.php?title=Syllogism&action=edit) by [verifying](https://en.wikipedia.org/wiki/Wikipedia:Verifiability "Wikipedia:Verifiability") the claims made and adding [inline citations](https://en.wikipedia.org/wiki/Wikipedia:Citing_sources#Inline_citations "Wikipedia:Citing sources"). Statements consisting only of original research should be removed. _(July 2020)_ _([Learn how and when to remove this message](https://en.wikipedia.org/wiki/Help:Maintenance_template_removal "Help:Maintenance template removal"))_|

[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Square_of_opposition%2C_set_diagrams.svg/250px-Square_of_opposition%2C_set_diagrams.svg.png)](https://en.wikipedia.org/wiki/File:Square_of_opposition,_set_diagrams.svg)

Relationships between the four types of propositions in the [square of opposition](https://en.wikipedia.org/wiki/Square_of_opposition "Square of opposition")  
  
(Black areas are empty,  
red areas are nonempty.)

Further information: [List of valid argument forms](https://en.wikipedia.org/wiki/List_of_valid_argument_forms "List of valid argument forms")

There are infinitely many possible syllogisms, but only 256 logically distinct types and only 24 valid types (enumerated below). A syllogism takes the form (note: M – Middle, S – subject, P – predicate.):

**Major premise**: All M are P.

**Minor premise**: All S are M.

**Conclusion/Consequent**: All S are P.

The premises and conclusion of a syllogism can be any of four types, which are labeled by letters[[14]](https://en.wikipedia.org/wiki/Syllogism#cite_note-14) as follows. The meaning of the letters is given by the table:

|code|quantifier|subject|copula|predicate|type|example|
|---|---|---|---|---|---|---|
|A|All|S|are|P|universal affirmative|All humans are mortal.|
|E|No|S|are|P|universal negative|No humans are perfect.|
|I|Some|S|are|P|particular affirmative|Some humans are healthy.|
|O|Some|S|are **not**|P|particular negative|Some humans are not old.|

In _[Prior Analytics](https://en.wikipedia.org/wiki/Prior_Analytics "Prior Analytics")_, Aristotle uses mostly the letters A, B, and C (Greek letters _[alpha](https://en.wikipedia.org/wiki/Alpha "Alpha")_, _[beta](https://en.wikipedia.org/wiki/Beta "Beta")_, and _[gamma](https://en.wikipedia.org/wiki/Gamma "Gamma")_) as term placeholders, rather than giving concrete examples. It is traditional to use _is_ rather than _are_ as the [copula](https://en.wikipedia.org/wiki/Copula_\(linguistics\) "Copula (linguistics)"), hence _All A is B_ rather than _All As are Bs_. It is traditional and convenient practice to use a, e, i, o as [infix operators](https://en.wikipedia.org/wiki/Infix_notation "Infix notation") so the categorical statements can be written succinctly. The following table shows the longer form, the succinct shorthand, and equivalent expressions in predicate logic:

|Form|Shorthand|Predicate logic|
|---|---|---|
|All A are B|AaB|∀x.A(x)→B(x)![{\displaystyle \forall x.A(x)\rightarrow B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9805e015b30fb6ccd8e100fad875068ebbede342)  _or_  ¬∃x.A(x)∧¬B(x)![{\displaystyle \neg \exists x.A(x)\land \neg B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/a3fdc3e51c5dc1811a4aed4ca44a648878b0d08a)|
|No A are B|AeB|¬∃x.A(x)∧B(x)![{\displaystyle \neg \exists x.A(x)\land B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/35e7f508e67f69b22aab025508eb1a00461306ea)  _or_  ∀x.A(x)→¬B(x)![{\displaystyle \forall x.A(x)\rightarrow \neg B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/bc17eae3b26e7ef25c41153cc9500592921cd185)|
|Some A are B|AiB|∃x.A(x)∧B(x)![{\displaystyle \exists x.A(x)\land B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/fb868bc1f3b29cb8bbb5cd4aa1a96118b8655d61)|
|Some A are not B|AoB|∃x.A(x)∧¬B(x)![{\displaystyle \exists x.A(x)\land \neg B(x)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/151effb8d18f3fc760e491e4c004e4dbb58a55d7)|

The convention here is that the letter S is the subject of the conclusion, P is the predicate of the conclusion, and M is the middle term. The major premise links M with P and the minor premise links M with S. However, the middle term can be either the subject or the predicate of each premise where it appears. The differing positions of the major, minor, and middle terms gives rise to another classification of syllogisms known as the _figure_. Given that in each case the conclusion is S-P, the four figures are:

|   |   |   |   |   |
|---|---|---|---|---|
||Figure 1|Figure 2|Figure 3|Figure 4|
|Major premise|M–P|P–M|M–P|P–M|
|Minor premise|S–M|S–M|M–S|M–S|

(Note, however, that following Aristotle's treatment of the figures, some logicians, such as [Peter Abelard](https://en.wikipedia.org/wiki/Peter_Abelard "Peter Abelard") and [Jean Buridan](https://en.wikipedia.org/wiki/Jean_Buridan "Jean Buridan"), do not regard the fourth figure as distinct from the first.)

Putting it all together, there are 256 possible types of syllogisms (or 512 if the order of the major and minor premises is changed, though this makes no difference logically). Each premise and the conclusion can be of type A, E, I or O, and the syllogism can be any of the four figures. A syllogism can be described briefly by giving the letters for the premises and conclusion followed by the number for the figure. For example, the syllogism BARBARA below is AAA-1, or "A-A-A in the first figure".

The vast majority of the 256 possible forms of syllogism are invalid (the conclusion does not [follow logically](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence") from the premises). The table below shows the valid forms. Even some of these are sometimes considered to commit the [existential fallacy](https://en.wikipedia.org/wiki/Existential_fallacy "Existential fallacy"), meaning they are invalid if they mention an empty category. These controversial patterns are marked in _italics_. All but four of the patterns in italics (felapton, darapti, fesapo and bamalip) are weakened moods, i.e. it is possible to draw a stronger conclusion from the premises.

|Figure 1|Figure 2|Figure 3|Figure 4|
|---|---|---|---|
|B**a**rb**a**r**a**|C**e**s**a**r**e**|D**a**t**i**s**i**|C**a**l**e**m**e**s|
|C**e**l**a**r**e**nt|C**a**m**e**str**e**s|D**i**s**a**m**i**s|D**i**m**a**t**i**s|
|D**a**r**ii**|F**e**st**i**n**o**|F**e**r**i**s**o**n|Fr**e**s**i**s**o**n|
|F**e**r**io**|B**a**r**o**c**o**|B**o**c**a**rd**o**|_C**a**l**e**m**o**s_|
|_B**a**rb**a**r**i**_|_C**e**s**a**r**o**_|_F**e**l**a**pt**o**n_|_F**e**s**a**p**o**_|
|_C**e**l**a**r**o**nt_|_C**a**m**e**str**o**s_|_D**a**r**a**pt**i**_|_B**a**m**a**l**i**p_|

The letters A, E, I, and O have been used since the [medieval Schools](https://en.wikipedia.org/wiki/Scholasticism "Scholasticism") to form [mnemonic](https://en.wikipedia.org/wiki/Mnemonic "Mnemonic") names for the forms as follows: 'Barbara' stands for AAA, 'Celarent' for EAE, etc.

Next to each premise and conclusion is a shorthand description of the sentence. So in AAI-3, the premise "All squares are rectangles" becomes "MaP"; the symbols mean that the first term ("square") is the middle term, the second term ("rectangle") is the predicate of the conclusion, and the relationship between the two terms is labeled "a" (All M are P).

The following table shows all syllogisms that are essentially different. The similar syllogisms share the same premises, just written in a different way. For example "Some pets are kittens" (SiM in [Darii](https://en.wikipedia.org/wiki/Syllogism#Darii_\(AII-1\))) could also be written as "Some kittens are pets" (MiS in Datisi).

In the Venn diagrams, the black areas indicate no elements, and the red areas indicate at least one element. In the predicate logic expressions, a horizontal bar over an expression means to negate ("logical not") the result of that expression.

It is also possible to use [graphs](https://en.wikipedia.org/wiki/Graph_\(discrete_mathematics\) "Graph (discrete mathematics)") (consisting of vertices and edges) to evaluate syllogisms.[[15]](https://en.wikipedia.org/wiki/Syllogism#cite_note-15)

### Examples

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Modus_Barbara_%28Euler%29.svg/250px-Modus_Barbara_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbara_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Modus_Barbara.svg/250px-Modus_Barbara.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbara.svg)|
|M: men  <br>S: Greeks      P: mortal|

  

#### Barbara (AAA-1)

   All men are mortal. (MaP)

   All Greeks are men. (SaM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") All Greeks are mortal. (SaP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Modus_Celarent_%28Euler%29.svg/250px-Modus_Celarent_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celarent_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Modus_Celarent.svg/250px-Modus_Celarent.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celarent.svg)|
|M: reptile  <br>S: snake      P: fur|

  

#### Celarent (EAE-1)

Similar: Cesare (EAE-2)

   No reptile has fur. (MeP)

   All snakes are reptiles. (SaM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") No snake has fur. (SeP)

|Camestres (AEE-2)|
|---|
|\|   \|   \|<br>\|---\|---\|<br>\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Modus_Camestres_%28Euler%29.svg/250px-Modus_Camestres_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestres_\(Euler\).svg)\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Modus_Camestres.svg/250px-Modus_Camestres.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestres.svg)\|<br>\|<br><br>  <br><br>[](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign")|

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Modus_Darii_%28Euler%29.svg/250px-Modus_Darii_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darii_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Modus_Darii.svg/250px-Modus_Darii.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darii.svg)|
|M: rabbit  <br>S: pet      P: fur|

  

#### Darii (AII-1)

Similar: Datisi (AII-3)

   All rabbits have fur. (MaP)

   Some pets are rabbits. (SiM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some pets have fur. (SiP)

|Disamis (IAI-3)|
|---|
|\|   \|   \|<br>\|---\|---\|<br>\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Modus_Disamis_%28Euler%29.svg/250px-Modus_Disamis_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Disamis_\(Euler\).svg)\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Modus_Disamis.svg/250px-Modus_Disamis.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Disamis.svg)\|<br>\|<br><br>  <br><br>[](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign")|

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Modus_Ferio_%28Euler%29.svg/250px-Modus_Ferio_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Ferio_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Modus_Ferio.svg/250px-Modus_Ferio.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Ferio.svg)|
|M: homework  <br>S: reading      P: fun|

  

#### Ferio (EIO-1)

Similar: Festino (EIO-2), Ferison (EIO-3), Fresison (EIO-4)

   No homework is fun. (MeP)

   Some reading is homework. (SiM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some reading is not fun. (SoP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Modus_Baroco_%28Euler%29.svg/250px-Modus_Baroco_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Baroco_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Modus_Baroco.svg/250px-Modus_Baroco.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Baroco.svg)|
|M: mammal  <br>S: pet      P: cat|

  

#### Baroco (AOO-2)

   All cats are mammals. (PaM)

   Some pets are not mammals. (SoM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some pets are not cats. (SoP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Modus_Bocardo_%28Euler%29.svg/250px-Modus_Bocardo_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bocardo_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Modus_Bocardo.svg/250px-Modus_Bocardo.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bocardo.svg)|
|M: cat  <br>S: mammal      P: pet|

  

#### Bocardo (OAO-3)

   Some cats are not pets. (MoP)

   All cats are mammals. (MaS)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some mammals are not pets. (SoP)

---

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Modus_Barbari_%28Euler%29.svg/250px-Modus_Barbari_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbari_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Modus_Barbari.svg/250px-Modus_Barbari.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbari.svg)|
|M: man  <br>S: Greek      P: mortal|

  

#### _Barbari (AAI-1)_

   All men are mortal. (MaP)

   All Greeks are men and some Greeks exist (SaM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some Greeks are mortal. (SiP)

|_Bamalip (AAI-4)_|
|---|
|\|   \|   \|<br>\|---\|---\|<br>\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Modus_Bamalip_%28Euler%29.svg/250px-Modus_Bamalip_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bamalip_\(Euler\).svg)\|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Modus_Bamalip.svg/250px-Modus_Bamalip.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bamalip.svg)\|<br>\|<br><br>[](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign")|

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Modus_Celaront_%28Euler%29.svg/250px-Modus_Celaront_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celaront_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Modus_Celaront.svg/250px-Modus_Celaront.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celaront.svg)|
|M: reptile  <br>S: snake      P: fur|

  

#### _Celaront (EAO-1)_

Similar: _Cesaro (EAO-2)_

   No reptiles have fur. (MeP)

   All snakes are reptiles. (SaM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some snakes have no fur. (SoP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Modus_Camestros_%28Euler%29.svg/250px-Modus_Camestros_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestros_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Modus_Camestros.svg/250px-Modus_Camestros.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestros.svg)|
|M: hooves  <br>S: human      P: horse|

  

#### _Camestros (AEO-2)_

Similar: _Calemos (AEO-4)_

   All horses have hooves. (PaM)

   No humans have hooves. (SeM)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some humans are not horses. (SoP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Modus_Felapton_%28Euler%29.svg/250px-Modus_Felapton_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Felapton_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Modus_Felapton.svg/250px-Modus_Felapton.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Felapton.svg)|
|M: flower  <br>S: plant      P: animal|

  

#### _Felapton (EAO-3)_

Similar: _Fesapo (EAO-4)_

   No flowers are animals. (MeP)

   All flowers are plants. (MaS)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some plants are not animals. (SoP)

|   |   |
|---|---|
|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Modus_Darapti_%28Euler%29.svg/250px-Modus_Darapti_%28Euler%29.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darapti_\(Euler\).svg)|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Modus_Darapti.svg/250px-Modus_Darapti.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darapti.svg)|
|M: square  <br>S: rhomb      P: rectangle|

  

#### _Darapti (AAI-3)_

   All [squares](https://en.wikipedia.org/wiki/Square_\(geometry\) "Square (geometry)") are [rectangles](https://en.wikipedia.org/wiki/Rectangle "Rectangle"). (MaP)

   All squares are [rhombuses](https://en.wikipedia.org/wiki/Rhombus "Rhombus"). (MaS)

[∴](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign") Some rhombuses are rectangles. (SiP)

### Table of all syllogisms

This table shows all 24 valid syllogisms, represented by [Venn diagrams](https://en.wikipedia.org/wiki/Venn_diagram "Venn diagram"). Columns indicate similarity, and are grouped by combinations of premises. Borders correspond to conclusions. Those with an existential assumption are dashed.

|   |   |   |   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|---|---|---|
Table of all 24 valid syllogisms 
||A ∧ A|   |A ∧ E|   |   |   |A ∧ I|   |A ∧ O|   |E ∧ I|
|1|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Modus_Barbara.svg/120px-Modus_Barbara.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbara.svg)<br><br>Barbara|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Modus_Barbari.svg/120px-Modus_Barbari.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Barbari.svg)<br><br>_Barbari_|||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Modus_Celarent.svg/120px-Modus_Celarent.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celarent.svg)<br><br>Celarent|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Modus_Celaront.svg/120px-Modus_Celaront.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Celaront.svg)<br><br>_Celaront_|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Modus_Darii.svg/120px-Modus_Darii.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darii.svg)<br><br>Darii||||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Modus_Ferio.svg/120px-Modus_Ferio.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Ferio.svg)<br><br>Ferio|
|2|||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Modus_Camestres.svg/120px-Modus_Camestres.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestres.svg)<br><br>Camestres|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Modus_Camestros.svg/120px-Modus_Camestros.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Camestros.svg)<br><br>_Camestros_|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Modus_Cesare.svg/120px-Modus_Cesare.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Cesare.svg)<br><br>Cesare|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Modus_Cesaro.svg/120px-Modus_Cesaro.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Cesaro.svg)<br><br>_Cesaro_|||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Modus_Baroco.svg/120px-Modus_Baroco.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Baroco.svg)<br><br>Baroco||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Modus_Festino.svg/120px-Modus_Festino.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Festino.svg)<br><br>Festino|
|3||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Modus_Darapti.svg/120px-Modus_Darapti.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Darapti.svg)<br><br>_Darapti_||||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Modus_Felapton.svg/120px-Modus_Felapton.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Felapton.svg)<br><br>_Felapton_|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Modus_Datisi.svg/120px-Modus_Datisi.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Datisi.svg)<br><br>Datisi|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Modus_Disamis.svg/120px-Modus_Disamis.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Disamis.svg)<br><br>Disamis||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Modus_Bocardo.svg/120px-Modus_Bocardo.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bocardo.svg)<br><br>Bocardo|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Modus_Ferison.svg/120px-Modus_Ferison.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Ferison.svg)<br><br>Ferison|
|4||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Modus_Bamalip.svg/120px-Modus_Bamalip.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Bamalip.svg)<br><br>_Bamalip_|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Modus_Calemes.svg/120px-Modus_Calemes.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Calemes.svg)<br><br>Calemes|[![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Modus_Calemos.svg/120px-Modus_Calemos.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Calemos.svg)<br><br>_Calemos_||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Modus_Fesapo.svg/120px-Modus_Fesapo.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Fesapo.svg)<br><br>_Fesapo_||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Modus_Dimatis.svg/120px-Modus_Dimatis.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Dimatis.svg)<br><br>Dimatis|||[![](https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Modus_Fresison.svg/120px-Modus_Fresison.svg.png)](https://en.wikipedia.org/wiki/File:Modus_Fresison.svg)<br><br>Fresison|

## Syllogistic fallacies

People often make mistakes when reasoning syllogistically.[[16]](https://en.wikipedia.org/wiki/Syllogism#cite_note-16)

For instance, from the premises some A are B, some B are C, people tend to come to a definitive conclusion that therefore some A are C.[[17]](https://en.wikipedia.org/wiki/Syllogism#cite_note-17)[[18]](https://en.wikipedia.org/wiki/Syllogism#cite_note-18) However, this does not follow according to the rules of classical logic. For instance, while some cats (A) are black things (B), and some black things (B) are televisions (C), it does not follow from the parameters that some cats (A) are televisions (C). This is because in the structure of the syllogism invoked (i.e. III-1) the middle term is not distributed in either the major premise or in the minor premise, a pattern called the "[fallacy of the undistributed middle](https://en.wikipedia.org/wiki/Fallacy_of_the_undistributed_middle "Fallacy of the undistributed middle")". Because of this, it can be hard to follow formal logic, and a closer eye is needed in order to ensure that an argument is, in fact, valid.[[19]](https://en.wikipedia.org/wiki/Syllogism#cite_note-19)

Determining the validity of a syllogism involves determining the [distribution](https://en.wikipedia.org/wiki/Distribution_of_terms "Distribution of terms") of each term in each statement, meaning whether all members of that term are accounted for.

In simple syllogistic patterns, the fallacies of invalid patterns are:

- [Undistributed middle](https://en.wikipedia.org/wiki/Fallacy_of_the_undistributed_middle "Fallacy of the undistributed middle"): Neither of the premises accounts for all members of the middle term, which consequently fails to link the major and minor term.
- [Illicit treatment of the major term](https://en.wikipedia.org/wiki/Illicit_major "Illicit major"): The conclusion implicates all members of the major term (P – meaning the proposition is negative); however, the major premise does not account for them all (i.e., P is either an affirmative predicate or a particular subject there).
- [Illicit treatment of the minor term](https://en.wikipedia.org/wiki/Illicit_minor "Illicit minor"): Same as above, but for the minor term (S – meaning the proposition is universal) and minor premise (where S is either a particular subject or an affirmative predicate).
- [Exclusive premises](https://en.wikipedia.org/wiki/Fallacy_of_exclusive_premises "Fallacy of exclusive premises"): Both premises are negative, meaning no link is established between the major and minor terms.
- [Affirmative conclusion from a negative premise](https://en.wikipedia.org/wiki/Affirmative_conclusion_from_a_negative_premise "Affirmative conclusion from a negative premise"): If either premise is negative, the conclusion must also be.

--


**Forward chaining** (or **forward reasoning**) is one of the two main methods of [reasoning](https://en.wikipedia.org/wiki/Automated_reasoning "Automated reasoning") when using an [inference engine](https://en.wikipedia.org/wiki/Inference_engine "Inference engine") and can be described logically as repeated application of _[modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens")_. Forward chaining is a popular implementation strategy for [expert systems](https://en.wikipedia.org/wiki/Expert_system "Expert system"), [business](https://en.wikipedia.org/wiki/Business_rules_engine "Business rules engine") and [production rule systems](https://en.wikipedia.org/wiki/Production_system_\(computer_science\) "Production system (computer science)"). The opposite of forward chaining is [backward chaining](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining").

Forward chaining starts with the available data and uses [inference rules](https://en.wikipedia.org/wiki/Inference_rule "Inference rule") to extract more data (from an end user, for example) until a goal is reached. An [inference engine](https://en.wikipedia.org/wiki/Inference_engine "Inference engine") using forward chaining searches the inference rules until it finds one where the [antecedent](https://en.wikipedia.org/wiki/Antecedent_\(logic\) "Antecedent (logic)") (**If** clause) is known to be true. When such a rule is found, the engine can conclude, or infer, the [consequent](https://en.wikipedia.org/wiki/Consequent "Consequent") (**Then** clause), resulting in the addition of new [information](https://en.wikipedia.org/wiki/Information "Information") to its data.[[1]](https://en.wikipedia.org/wiki/Forward_chaining#cite_note-1)

Inference engines will [iterate](https://en.wikipedia.org/wiki/Iteration#Computing "Iteration") through this process until a goal is reached.

## Example

Suppose that the goal is to conclude the color of a pet named Fritz, given that he croaks and eats flies, and that the [rule base](https://en.wikipedia.org/wiki/Rule_base "Rule base") contains the following four rules:

1. **If** _X_ croaks and _X_ eats flies - **Then** _X_ is a frog
2. **If** _X_ chirps and _X_ sings - **Then** _X_ is a canary
3. **If** _X_ is a frog - **Then** _X_ is green
4. **If** _X_ is a canary - **Then** _X_ is blue

Let us illustrate forward chaining by following the pattern of a computer as it evaluates the rules. Assume the following facts:

- Fritz croaks
- Fritz eats flies

With forward reasoning, the inference engine can derive that Fritz is green in a series of steps:

1. Since the base facts indicate that "Fritz croaks" and "Fritz eats flies", the antecedent of rule #1 is satisfied by substituting Fritz for _X_, and the inference engine concludes:

 Fritz is a frog

2. The antecedent of rule #3 is then satisfied by substituting Fritz for _X_, and the inference engine concludes:

 Fritz is green

The name "forward chaining" comes from the fact that the inference engine starts with the data and reasons its way to the answer, as opposed to [backward chaining](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining"), which works the other way around. In the derivation, the rules are used in the opposite order as compared to [backward chaining](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining"). In this example, rules #2 and #4 were not used in determining that Fritz is green.

Because the data determines which rules are selected and used, this method is called [data-driven](https://en.wikipedia.org/wiki/Data-driven_science "Data-driven science"), in contrast to [goal-driven](https://en.wikipedia.org/wiki/Goal-oriented "Goal-oriented") [backward chaining](https://en.wikipedia.org/wiki/Backward_chaining "Backward chaining") inference. The forward chaining approach is often employed by [expert systems](https://en.wikipedia.org/wiki/Expert_system "Expert system"), such as [CLIPS](https://en.wikipedia.org/wiki/CLIPS "CLIPS").

One of the advantages of forward-chaining over backward-chaining is that the reception of new data can trigger new inferences, which makes the engine better suited to dynamic situations in which conditions are likely to change.[[2]](https://en.wikipedia.org/wiki/Forward_chaining#cite_note-Hayes-Roth_1983-2)[[3]](https://en.wikipedia.org/wiki/Forward_chaining#cite_note-3)


---


**Backward chaining** (or **backward reasoning**) is an [inference](https://en.wikipedia.org/wiki/Inference "Inference") method described colloquially as working backward from the goal. It is used in [automated theorem provers](https://en.wikipedia.org/wiki/Automated_theorem_prover "Automated theorem prover"), [inference engines](https://en.wikipedia.org/wiki/Inference_engine "Inference engine"), [proof assistants](https://en.wikipedia.org/wiki/Proof_assistant "Proof assistant"), and other [artificial intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence "Artificial intelligence") applications.[[1]](https://en.wikipedia.org/wiki/Backward_chaining#cite_note-1)

In [game theory](https://en.wikipedia.org/wiki/Game_theory "Game theory"), researchers apply it to (simpler) [subgames](https://en.wikipedia.org/wiki/Subgame "Subgame") to find a solution to the game, in a process called _[backward induction](https://en.wikipedia.org/wiki/Backward_induction "Backward induction")_. In chess, it is called [retrograde analysis](https://en.wikipedia.org/wiki/Retrograde_analysis "Retrograde analysis"), and it is used to generate table bases for [chess endgames](https://en.wikipedia.org/wiki/Chess_endgame "Chess endgame") for [computer chess](https://en.wikipedia.org/wiki/Computer_chess "Computer chess").

Backward chaining is implemented in [logic programming](https://en.wikipedia.org/wiki/Logic_programming "Logic programming") by [SLD resolution](https://en.wikipedia.org/wiki/SLD_resolution "SLD resolution"). Both rules are based on the [modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens") inference rule. It is one of the two most commonly used methods of [reasoning](https://en.wikipedia.org/wiki/Reasoning "Reasoning") with [inference rules](https://en.wikipedia.org/wiki/Inference_rule "Inference rule") and [logical implications](https://en.wikipedia.org/wiki/Logical_consequence "Logical consequence") – the other is [forward chaining](https://en.wikipedia.org/wiki/Forward_chaining "Forward chaining"). Backward chaining systems usually employ a [depth-first search](https://en.wikipedia.org/wiki/Depth-first_search "Depth-first search") strategy, e.g. [Prolog](https://en.wikipedia.org/wiki/Prolog "Prolog").[[2]](https://en.wikipedia.org/wiki/Backward_chaining#cite_note-CheinMugnier2009-2)

## Usage

Backward chaining starts with a list of [goals](https://en.wikipedia.org/wiki/Goal "Goal") (or a [hypothesis](https://en.wikipedia.org/wiki/Hypothesis "Hypothesis")) and works backwards from the [consequent](https://en.wikipedia.org/wiki/Consequent "Consequent") to the [antecedent](https://en.wikipedia.org/wiki/Antecedent_\(logic\) "Antecedent (logic)") to see if any [data](https://en.wikipedia.org/wiki/Data "Data") supports any of these consequents.[[3]](https://en.wikipedia.org/wiki/Backward_chaining#cite_note-Norwig_Definition-3) An [inference engine](https://en.wikipedia.org/wiki/Inference_engine "Inference engine") using backward chaining would search the [inference](https://en.wikipedia.org/wiki/Inference "Inference") rules until it finds one with a consequent (**Then** clause) that matches a desired goal. If the antecedent (**If** clause) of that rule is not known to be true, then it is added to the list of goals (for one's goal to be confirmed one must also provide data that confirms this new rule).

For example, suppose a new pet, Fritz, is delivered in an opaque box along with two facts about Fritz:

- Fritz croaks
- Fritz eats flies

The goal is to decide whether Fritz is green, based on a [rule base](https://en.wikipedia.org/wiki/Rule_base "Rule base") containing the following four rules:

[![An Example of Backward Chaining.](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Backward_Chaining_Frog_Color_Example.png/250px-Backward_Chaining_Frog_Color_Example.png)](https://en.wikipedia.org/wiki/File:Backward_Chaining_Frog_Color_Example.png)

An example of backward chaining

1. **If** X croaks and X eats flies – **Then** X is a frog
2. **If** X chirps and X sings – **Then** X is a canary
3. **If** X is a frog – **Then** X is green
4. **If** X is a canary – **Then** X is yellow

With backward reasoning, an inference engine can determine whether Fritz is green in four steps. To start, the query is phrased as a goal assertion that is to be proven: "Fritz is green".

1. Fritz is substituted for X in rule #3 to see if its consequent matches the goal, so rule #3 becomes:

 **If** Fritz is a frog – **Then** Fritz is green

Since the consequent matches the goal ("Fritz is green"), the rules engine now needs to see if the antecedent ("Fritz is a frog") can be proven. The antecedent, therefore, becomes the new goal:

 Fritz is a frog

2. Again substituting Fritz for X, rule #1 becomes:

 **If** Fritz croaks and Fritz eats flies – **Then** Fritz is a frog

Since the consequent matches the current goal ("Fritz is a frog"), the inference engine now needs to see if the antecedent ("Fritz croaks and eats flies") can be proven. The antecedent, therefore, becomes the new goal:

 Fritz croaks and Fritz eats flies

3. Since this goal is a conjunction of two statements, the inference engine breaks it into two sub-goals, both of which must be proven:

 Fritz croaks
 Fritz eats flies

4. To prove both of these sub-goals, the inference engine sees that both of these sub-goals were given as initial facts. Therefore, the conjunction is true:

 Fritz croaks and Fritz eats flies

therefore the antecedent of rule #1 is true and the consequent must be true:

 Fritz is a frog

therefore the antecedent of rule #3 is true and the consequent must be true:

 Fritz is green

This derivation, therefore, allows the inference engine to prove that Fritz is green. Rules #2 and #4 were not used.

Note that the goals always match the affirmed versions of the consequents of implications (and not the negated versions as in [modus tollens](https://en.wikipedia.org/wiki/Modus_tollens "Modus tollens")) and even then, their antecedents are then considered as the new goals (and not the conclusions as in [affirming the consequent](https://en.wikipedia.org/wiki/Affirming_the_consequent "Affirming the consequent")), which ultimately must match known facts (usually defined as consequents whose antecedents are always true); thus, the inference rule used is [modus ponens](https://en.wikipedia.org/wiki/Modus_ponens "Modus ponens").

Because the list of goals determines which rules are selected and used, this method is called [goal-driven](https://en.wikipedia.org/wiki/Goal-oriented "Goal-oriented"), in contrast to [data-driven](https://en.wikipedia.org/wiki/Data_science "Data science") [forward-chaining](https://en.wikipedia.org/wiki/Forward_chaining "Forward chaining") inference. The backward chaining approach is often employed by [expert systems](https://en.wikipedia.org/wiki/Expert_systems "Expert systems").

Programming languages such as [Prolog](https://en.wikipedia.org/wiki/Prolog "Prolog"), [Knowledge Machine](https://en.wikipedia.org/wiki/Knowledge_Machine "Knowledge Machine") and [ECLiPSe](https://en.wikipedia.org/wiki/ECLiPSe "ECLiPSe") support backward chaining within their inference engines.[[4]](https://en.wikipedia.org/wiki/Backward_chaining#cite_note-Programming_Languages-4)


---


**Minimax** (sometimes **Minmax**, **MM**[[1]](https://en.wikipedia.org/wiki/Minimax#cite_note-1) or **saddle point**[[2]](https://en.wikipedia.org/wiki/Minimax#cite_note-2)) is a decision rule used in [artificial intelligence](https://en.wikipedia.org/wiki/Artificial_intelligence "Artificial intelligence"), [decision theory](https://en.wikipedia.org/wiki/Decision_theory "Decision theory"), [combinatorial game theory](https://en.wikipedia.org/wiki/Combinatorial_game_theory "Combinatorial game theory"), [statistics](https://en.wikipedia.org/wiki/Statistics "Statistics"), and [philosophy](https://en.wikipedia.org/wiki/Philosophy "Philosophy") for _minimizing_ the possible [loss](https://en.wikipedia.org/wiki/Loss_function "Loss function") for a [worst case (_max_imum loss) scenario](https://en.wikipedia.org/wiki/Worst-case_scenario "Worst-case scenario"). When dealing with gains, it is referred to as "maximin" – to maximize the minimum gain. Originally formulated for several-player [zero-sum](https://en.wikipedia.org/wiki/Zero-sum "Zero-sum") [game theory](https://en.wikipedia.org/wiki/Game_theory "Game theory"), covering both the cases where players take alternate moves and those where they make simultaneous moves, it has also been extended to more complex games and to general decision-making in the presence of uncertainty.

## Game theory

### In general games

The **maximin value** is the highest value that the player can be sure to get without knowing the actions of the other players; equivalently, it is the lowest value the other players can force the player to receive when they know the player's action. Its formal definition is:[[3]](https://en.wikipedia.org/wiki/Minimax#cite_note-ZMS2013-3)

vi_=maxaimina−ivi(ai,a−i)![{\displaystyle {\underline {v_{i}}}=\max _{a_{i}}\min _{a_{-i}}{v_{i}(a_{i},a_{-i})}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/76d2fe8fe2fc328093c7b0c19e83a0197004a5d3)

Where:

- i is the index of the player of interest.
- −i![{\displaystyle -i}](https://wikimedia.org/api/rest_v1/media/math/render/svg/91fddb9f89a520937db3a8821575068cdcc76f60) denotes all other players except player i.
- ai![{\displaystyle a_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/0bc77764b2e74e64a63341054fa90f3e07db275f) is the action taken by player i.
- a−i![{\displaystyle a_{-i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/42ad62ea9270fed5d53c1ec1d7f41177e50d0abf) denotes the actions taken by all other players.
- vi![{\displaystyle v_{i}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7dffe5726650f6daac54829972a94f38eb8ec127) is the value function of player i.

Calculating the maximin value of a player is done in a worst-case approach: for each possible action of the player, we check all possible actions of the other players and determine the worst possible combination of actions – the one that gives player i the smallest value. Then, we determine which action player i can take in order to make sure that this smallest value is the highest possible.

For example, consider the following game for two players, where the first player ("row player") may choose any of three moves, labelled T, M, or B, and the second player ("column player") may choose either of two moves, L or R. The result of the combination of both moves is expressed in a payoff table:

LRT3,12,−20M5,0−10,1B−100,24,4![{\displaystyle {\begin{array}{c|cc}\hline &L&R\\\hline T&3,1&2,-20\\M&5,0&-10,1\\B&-100,2&4,4\\\hline \end{array}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/c94218d6211047370d9243ce80081b8860b90c33)

(where the first number in each of the cell is the pay-out of the row player and the second number is the pay-out of the column player).

For the sake of example, we consider only [pure strategies](https://en.wikipedia.org/wiki/Strategy_\(game_theory\)#Pure_and_mixed_strategies "Strategy (game theory)"). Check each player in turn:

- The row player can play T, which guarantees them a payoff of at least 2 (playing B is risky since it can lead to payoff −100, and playing M can result in a payoff of −10). Hence: vrow_=2![{\displaystyle {\underline {v_{row}}}=2}](https://wikimedia.org/api/rest_v1/media/math/render/svg/a2506f62ac53a3d64ade893dca7134bd4142a037).
- The column player can play L and secure a payoff of at least 0 (playing R puts them in the risk of getting −20![{\displaystyle -20}](https://wikimedia.org/api/rest_v1/media/math/render/svg/498de4e7b3ddc127b4be006bd2efafed19fa120d)). Hence: vcol_=0![{\displaystyle {\underline {v_{col}}}=0}](https://wikimedia.org/api/rest_v1/media/math/render/svg/05ec335c2a2babeb8424432c8f1552b0c8dded90).

If both players play their respective maximin strategies (T,L)![{\displaystyle (T,L)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/20493aa06e4ba84a0057e0fc6a261dc87667ca8e), the payoff vector is (3,1)![{\displaystyle (3,1)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/a8933db1c87b5fefc8d54c6e2d157e4b343bb8b8).

The **minimax value** of a player is the smallest value that the other players can force the player to receive, without knowing the player's actions; equivalently, it is the largest value the player can be sure to get when they _know_ the actions of the other players. Its formal definition is:[[3]](https://en.wikipedia.org/wiki/Minimax#cite_note-ZMS2013-3)

vi¯=mina−imaxaivi(ai,a−i)![{\displaystyle {\overline {v_{i}}}=\min _{a_{-i}}\max _{a_{i}}{v_{i}(a_{i},a_{-i})}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/074c806d741e20cc0e770027e6efcb9796b72871)

The definition is very similar to that of the maximin value – only the order of the maximum and minimum operators is inverse. In the above example:

- The row player can get a maximum value of 4 (if the other player plays R) or 5 (if the other player plays L), so: vrow¯=4 .![{\displaystyle {\overline {v_{row}}}=4\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/3bb013feb5d042115f8d5cc01f598af02e78ed1b)
- The column player can get a maximum value of 1 (if the other player plays T), 1 (if M) or 4 (if B). Hence: vcol¯=1 .![{\displaystyle {\overline {v_{col}}}=1\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/532e4596876de0ce798f69db3dbf268369e6c3ce)

For every player i, the maximin is at most the minimax:

vi_≤vi¯![{\displaystyle {\underline {v_{i}}}\leq {\overline {v_{i}}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/36dd33ead0af78f7bfbc890a8b6561a5203e7289)

Intuitively, in maximin the maximization comes after the minimization, so player i tries to maximize their value before knowing what the others will do; in minimax the maximization comes before the minimization, so player i is in a much better position – they maximize their value knowing what the others did.

Another way to understand the _notation_ is by reading from right to left: When we write

vi¯=mina−imaxaivi(ai,a−i)=mina−i(maxaivi(ai,a−i))![{\displaystyle {\overline {v_{i}}}=\min _{a_{-i}}\max _{a_{i}}{v_{i}(a_{i},a_{-i})}=\min _{a_{-i}}{\Big (}\max _{a_{i}}{v_{i}(a_{i},a_{-i})}{\Big )}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/77e920b4e68020c5447fb03276dfc107aa8c3a82)

the initial set of outcomes  vi(ai,a−i) ![{\displaystyle \ v_{i}(a_{i},a_{-i})\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/81bb566eb8a83bcae4d5b2a53b4eefcdd71d733b)  depends on both  ai ![{\displaystyle \ {a_{i}}\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/b6cb382086935b075ac6de7671af9d0e8d3e7139)  and  a−i .![{\displaystyle \ {a_{-i}}\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/04bbd96afafec00598355429d921db457429f8c4) We first _marginalize away_ ai![{\displaystyle {a_{i}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7b451383d62588c35b768dd4595ba364ab417139) from vi(ai,a−i)![{\displaystyle v_{i}(a_{i},a_{-i})}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d6d9fc159469cf6df16c86e019b298557ee7c751), by maximizing over  ai ![{\displaystyle \ {a_{i}}\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/b6cb382086935b075ac6de7671af9d0e8d3e7139)  (for every possible value of a−i![{\displaystyle {a_{-i}}}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9194a406a3213d04cc60dc4be73e3f5160bbe15d)) to yield a set of marginal outcomes  vi′(a−i),![{\displaystyle \ v'_{i}(a_{-i})\,,}](https://wikimedia.org/api/rest_v1/media/math/render/svg/4a093923d26d7efb76ba8cc299e28280fae84b4e) which depends only on  a−i .![{\displaystyle \ {a_{-i}}\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/04bbd96afafec00598355429d921db457429f8c4) We then minimize over  a−i ![{\displaystyle \ {a_{-i}}\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/78ff62123276cf371d055c30d87f143b69a5183f)  over these outcomes. (Conversely for maximin.)

Although it is always the case that  vrow_≤vrow¯ ![{\displaystyle \ {\underline {v_{row}}}\leq {\overline {v_{row}}}\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/e848cffb8643e2f0942b8642955807c86dac4b25)  and  vcol_≤vcol¯,![{\displaystyle \ {\underline {v_{col}}}\leq {\overline {v_{col}}}\,,}](https://wikimedia.org/api/rest_v1/media/math/render/svg/f6b41fd0145bfb716a9496dea1dd4e94a3a9b14a) the payoff vector resulting from both players playing their minimax strategies,  (2,−20) ![{\displaystyle \ (2,-20)\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/c8844bb63fc604748f97c0b22edfd9b561c3f70d)  in the case of  (T,R) ![{\displaystyle \ (T,R)\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/fd5d3332dfd6375116f8cb91d04ad41855c1f879)  or (−10,1)![{\displaystyle (-10,1)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/d864d6c2532b278cfcefb38f1b33d339f3b5d5f5) in the case of  (M,R),![{\displaystyle \ (M,R)\,,}](https://wikimedia.org/api/rest_v1/media/math/render/svg/918d3e7264b7e3bf37ae54d64c1369bf1f69a533) cannot similarly be ranked against the payoff vector  (3,1) ![{\displaystyle \ (3,1)\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/0a5d36f237d70e3b479f2426a70b68128638da23)  resulting from both players playing their maximin strategy.

### In zero-sum games

In two-player [zero-sum games](https://en.wikipedia.org/wiki/Zero-sum_game "Zero-sum game"), the minimax solution is the same as the [Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium "Nash equilibrium").

In the context of zero-sum games, the [minimax theorem](https://en.wikipedia.org/wiki/Minimax_theorem "Minimax theorem") is equivalent to:[[4]](https://en.wikipedia.org/wiki/Minimax#cite_note-Osborne-4)[_[failed verification](https://en.wikipedia.org/wiki/Wikipedia:Verifiability "Wikipedia:Verifiability")_]

> For every two-person [zero-sum](https://en.wikipedia.org/wiki/Zero-sum "Zero-sum") game with finitely many strategies, there exists a value V and a mixed strategy for each player, such that
> 
> (a) Given Player 2's strategy, the best payoff possible for Player 1 is V, and
> 
> (b) Given Player 1's strategy, the best payoff possible for Player 2 is −V.

Equivalently, Player 1's strategy guarantees them a payoff of V regardless of Player 2's strategy, and similarly Player 2 can guarantee themselves a payoff of −V. The name _minimax_ arises because each player minimizes the maximum payoff possible for the other – since the game is zero-sum, they also minimize their own maximum loss (i.e., maximize their minimum payoff). See also [example of a game without a value](https://en.wikipedia.org/wiki/Example_of_a_game_without_a_value "Example of a game without a value").

### Example

|   |   |   |   |
|---|---|---|---|
Payoff matrix for player A
||B chooses B1|B chooses B2|B chooses B3|
|A chooses A1|+3|−2|+2|
|A chooses A2|−1|0|+4|
|A chooses A3|−4|−3|+1|

The following example of a zero-sum game, where **A** and **B** make simultaneous moves, illustrates _maximin_ solutions. Suppose each player has three choices and consider the [payoff matrix](https://en.wikipedia.org/wiki/Payoff_matrix "Payoff matrix") for **A** displayed on the table ("Payoff matrix for player A"). Assume the payoff matrix for **B** is the same matrix with the signs reversed (i.e., if the choices are A1 and B1 then **B** pays 3 to **A**). Then, the maximin choice for **A** is A2 since the worst possible result is then having to pay 1, while the simple maximin choice for **B** is B2 since the worst possible result is then no payment. However, this solution is not stable, since if **B** believes **A** will choose A2 then **B** will choose B1 to gain 1; then if **A** believes **B** will choose B1 then **A** will choose A1 to gain 3; and then **B** will choose B2; and eventually both players will realize the difficulty of making a choice. So a more stable strategy is needed.

Some choices are _dominated_ by others and can be eliminated: **A** will not choose A3 since either A1 or A2 will produce a better result, no matter what **B** chooses; **B** will not choose B3 since some mixtures of B1 and B2 will produce a better result, no matter what **A** chooses.

Player **A** can avoid having to make an expected payment of more than ⁠1/ 3 ⁠ by choosing A1 with probability ⁠1/ 6 ⁠ and A2 with probability ⁠5/ 6 ⁠: The expected payoff for **A** would be   3 × ⁠1/ 6 ⁠ − 1 × ⁠5/ 6 ⁠ = ⁠−+1/ 3 ⁠   in case **B** chose B1 and   −2 × ⁠1/6 ⁠ + 0 × ⁠5/ 6 ⁠ = ⁠−+1/ 3 ⁠   in case **B** chose B2. Similarly, **B** can ensure an expected gain of at least ⁠1/ 3 ⁠, no matter what **A** chooses, by using a randomized strategy of choosing B1 with probability ⁠1/ 3 ⁠ and B2 with probability ⁠2/ 3 ⁠. These [mixed](https://en.wikipedia.org/wiki/Mixed_strategy "Mixed strategy") minimax strategies cannot be improved and are now stable.

### Maximin

Frequently, in game theory, **maximin** is distinct from minimax. Minimax is used in zero-sum games to denote minimizing the opponent's maximum payoff. In a [zero-sum game](https://en.wikipedia.org/wiki/Zero-sum_game "Zero-sum game"), this is identical to minimizing one's own maximum loss, and to maximizing one's own minimum gain.

"Maximin" is a term commonly used for non-zero-sum games to describe the strategy which maximizes one's own minimum payoff. In non-zero-sum games, this is not generally the same as minimizing the opponent's maximum gain, nor the same as the [Nash equilibrium](https://en.wikipedia.org/wiki/Nash_equilibrium "Nash equilibrium") strategy.

### In repeated games

The minimax values are very important in the theory of [repeated games](https://en.wikipedia.org/wiki/Repeated_games "Repeated games"). One of the central theorems in this theory, the [folk theorem](https://en.wikipedia.org/wiki/Folk_theorem_\(game_theory\) "Folk theorem (game theory)"), relies on the minimax values.

## Combinatorial game theory

In [combinatorial game theory](https://en.wikipedia.org/wiki/Combinatorial_game_theory "Combinatorial game theory"), there is a minimax algorithm for game solutions.

A **simple** version of the minimax _algorithm_, stated below, deals with games such as [tic-tac-toe](https://en.wikipedia.org/wiki/Tic-tac-toe "Tic-tac-toe"), where each player can win, lose, or draw. If player A _can_ win in one move, their best move is that winning move. If player B knows that one move will lead to the situation where player A _can_ win in one move, while another move will lead to the situation where player A can, at best, draw, then player B's best move is the one leading to a draw. Late in the game, it's easy to see what the "best" move is. The minimax algorithm helps find the best move, by working backwards from the end of the game. At each step it assumes that player A is trying to **maximize** the chances of A winning, while on the next turn player B is trying to **minimize** the chances of A winning (i.e., to maximize B's own chances of winning).

### Minimax algorithm with alternate moves

A **minimax algorithm**[[5]](https://en.wikipedia.org/wiki/Minimax#cite_note-5) is a recursive [algorithm](https://en.wikipedia.org/wiki/Algorithm "Algorithm") for choosing the next move in an n-player [game](https://en.wikipedia.org/wiki/Game_theory "Game theory"), usually a two-player game. A value is associated with each position or state of the game. This value is computed by means of a [position evaluation function](https://en.wikipedia.org/wiki/Evaluation_function "Evaluation function") and it indicates how good it would be for a player to reach that position. The player then makes the move that maximizes the minimum value of the position resulting from the opponent's possible following moves. If it is **A**'s turn to move, **A** gives a value to each of their legal moves.

A possible allocation method consists in assigning a certain win for **A** as +1 and for **B** as −1. This leads to [combinatorial game theory](https://en.wikipedia.org/wiki/Combinatorial_game_theory "Combinatorial game theory") as developed by [John H. Conway](https://en.wikipedia.org/wiki/John_Horton_Conway "John Horton Conway"). An alternative is using a rule that if the result of a move is an immediate win for **A**, it is assigned positive infinity and if it is an immediate win for **B**, negative infinity. The value to **A** of any other move is the maximum of the values resulting from each of **B**'s possible replies. For this reason, **A** is called the _maximizing player_ and **B** is called the _minimizing player_, hence the name _minimax algorithm_. The above algorithm will assign a value of positive or negative infinity to any position since the value of every position will be the value of some final winning or losing position. Often this is generally only possible at the very end of complicated games such as [chess](https://en.wikipedia.org/wiki/Chess "Chess") or [go](https://en.wikipedia.org/wiki/Go_\(board_game\) "Go (board game)"), since it is not computationally feasible to look ahead as far as the completion of the game, except towards the end, and instead, positions are given finite values as estimates of the degree of belief that they will lead to a win for one player or another.

This can be extended if we can supply a [heuristic](https://en.wikipedia.org/wiki/Heuristic "Heuristic") evaluation function which gives values to non-final game states without considering all possible following complete sequences. We can then limit the minimax algorithm to look only at a certain number of moves ahead. This number is called the "look-ahead", measured in "[plies](https://en.wikipedia.org/wiki/Ply_\(chess\) "Ply (chess)")". For example, the chess computer [Deep Blue](https://en.wikipedia.org/wiki/IBM_Deep_Blue "IBM Deep Blue") (the first one to beat a reigning world champion, [Garry Kasparov](https://en.wikipedia.org/wiki/Garry_Kasparov "Garry Kasparov") at that time) looked ahead at least 12 plies, then applied a heuristic evaluation function.[[6]](https://en.wikipedia.org/wiki/Minimax#cite_note-6)

The algorithm can be thought of as exploring the [nodes](https://en.wikipedia.org/wiki/Node_\(computer_science\) "Node (computer science)") of a _[game tree](https://en.wikipedia.org/wiki/Game_tree "Game tree")_. The _effective [branching factor](https://en.wikipedia.org/wiki/Branching_factor "Branching factor")_ of the tree is the average number of [children](https://en.wikipedia.org/wiki/Child_node "Child node") of each node (i.e., the average number of legal moves in a position). The number of nodes to be explored usually [increases exponentially](https://en.wikipedia.org/wiki/Exponential_growth "Exponential growth") with the number of plies (it is less than exponential if evaluating [forced moves](https://en.wikipedia.org/wiki/Forced_move "Forced move") or repeated positions). The number of nodes to be explored for the analysis of a game is therefore approximately the branching factor raised to the power of the number of plies. It is therefore [impractical](https://en.wikipedia.org/wiki/Computational_complexity_theory#Intractability "Computational complexity theory") to completely analyze games such as chess using the minimax algorithm.

The performance of the naïve minimax algorithm may be improved dramatically, without affecting the result, by the use of [alpha–beta pruning](https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning "Alpha–beta pruning"). Other heuristic pruning methods can also be used, but not all of them are guaranteed to give the same result as the unpruned search.

A naïve minimax algorithm may be trivially modified to additionally return an entire [Principal Variation](https://en.wikipedia.org/wiki/Variation_\(game_tree\)#Principal_variation "Variation (game tree)") along with a minimax score.

### Pseudocode

The [pseudocode](https://en.wikipedia.org/wiki/Pseudocode "Pseudocode") for the depth-limited minimax algorithm is given below.

**function** minimax(node, depth, maximizingPlayer) **is**
    **if** depth = 0 **or** node is a terminal node **then**
        **return** the heuristic value of node
    **if** maximizingPlayer **then**
        value := −∞
        **for each** child of node **do**
            value := max(value, minimax(child, depth − 1, FALSE))
        **return** value
    **else** _(* minimizing player *)_
        value := +∞
        **for each** child of node **do**
            value := min(value, minimax(child, depth − 1, TRUE))
        **return** value

_(* Initial call *)_
minimax(origin, depth, TRUE)

The minimax function returns a heuristic value for [leaf nodes](https://en.wikipedia.org/wiki/Leaf_nodes "Leaf nodes") (terminal nodes and nodes at the maximum search depth). Non-leaf nodes inherit their value from a descendant leaf node. The heuristic value is a score measuring the favorability of the node for the maximizing player. Hence nodes resulting in a favorable outcome, such as a win, for the maximizing player have higher scores than nodes more favorable for the minimizing player. The heuristic value for terminal (game ending) leaf nodes are scores corresponding to win, loss, or draw, for the maximizing player. For non terminal leaf nodes at the maximum search depth, an evaluation function estimates a heuristic value for the node. The quality of this estimate and the search depth determine the quality and accuracy of the final minimax result.

Minimax treats the two players (the maximizing player and the minimizing player) separately in its code. Based on the observation that  max(a,b)=−min(−a,−b) ,![{\displaystyle \ \max(a,b)=-\min(-a,-b)\ ,}](https://wikimedia.org/api/rest_v1/media/math/render/svg/783d0a48a7d334535ee3117c0795d5d51f65710e) minimax may often be simplified into the [negamax](https://en.wikipedia.org/wiki/Negamax "Negamax") algorithm.

### Example

[![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Minimax.svg/500px-Minimax.svg.png)](https://en.wikipedia.org/wiki/File:Minimax.svg)

A minimax tree example

[![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Plminmax.gif/500px-Plminmax.gif)](https://en.wikipedia.org/wiki/File:Plminmax.gif)

An animated pedagogical example that attempts to be human-friendly by substituting initial infinite (or arbitrarily large) values for emptiness and by avoiding using the [negamax](https://en.wikipedia.org/wiki/Negamax "Negamax") coding simplifications.

Suppose the game being played only has a maximum of two possible moves per player each turn. The algorithm generates the [tree](https://en.wikipedia.org/wiki/Game_tree "Game tree") on the right, where the circles represent the moves of the player running the algorithm (_maximizing player_), and squares represent the moves of the opponent (_minimizing player_). Because of the limitation of computation resources, as explained above, the tree is limited to a _look-ahead_ of 4 moves.

The algorithm evaluates each _[leaf node](https://en.wikipedia.org/wiki/Leaf_node "Leaf node")_ using a heuristic evaluation function, obtaining the values shown. The moves where the _maximizing player_ wins are assigned with positive infinity, while the moves that lead to a win of the _minimizing player_ are assigned with negative infinity. At level 3, the algorithm will choose, for each node, the **smallest** of the _[child node](https://en.wikipedia.org/wiki/Child_node "Child node")_ values, and assign it to that same node (e.g. the node on the left will choose the minimum between "10" and "+∞", therefore assigning the value "10" to itself). The next step, in level 2, consists of choosing for each node the **largest** of the _child node_ values. Once again, the values are assigned to each _[parent node](https://en.wikipedia.org/wiki/Parent_node "Parent node")_. The algorithm continues evaluating the maximum and minimum values of the child nodes alternately until it reaches the _[root node](https://en.wikipedia.org/wiki/Root_node "Root node")_, where it chooses the move with the largest value (represented in the figure with a blue arrow). This is the move that the player should make in order to _minimize_ the _maximum_ possible [loss](https://en.wikipedia.org/wiki/Loss_function "Loss function").

## For individual decisions

### In the face of uncertainty

Minimax theory has been extended to decisions where there is no other player, but where the consequences of decisions depend on unknown facts. For example, deciding to prospect for minerals entails a cost, which will be wasted if the minerals are not present, but will bring major rewards if they are. One approach is to treat this as a game against _nature_ (see [move by nature](https://en.wikipedia.org/wiki/Move_by_nature "Move by nature")), and using a similar mindset as [Murphy's law](https://en.wikipedia.org/wiki/Murphy%27s_law "Murphy's law") or [resistentialism](https://en.wikipedia.org/wiki/Resistentialism "Resistentialism"), take an approach which minimizes the maximum expected loss, using the same techniques as in the two-person zero-sum games.

In addition, [expectiminimax trees](https://en.wikipedia.org/wiki/Expectiminimax_tree "Expectiminimax tree") have been developed, for two-player games in which chance (for example, dice) is a factor.

### Criterion in statistical decision theory

Main article: [Minimax estimator](https://en.wikipedia.org/wiki/Minimax_estimator "Minimax estimator")

In classical statistical [decision theory](https://en.wikipedia.org/wiki/Decision_theory "Decision theory"), we have an [estimator](https://en.wikipedia.org/wiki/Estimator "Estimator")  δ ![{\displaystyle \ \delta \ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/f849a31e497be33fca8db9b71119138c5a9bb41b)  that is used to estimate a [parameter](https://en.wikipedia.org/wiki/Parameter "Parameter")  θ∈Θ .![{\displaystyle \ \theta \in \Theta \ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/7b1ee28f61e8f32d56a28a269c670d5008afc2d9) We also assume a [risk function](https://en.wikipedia.org/wiki/Risk_function "Risk function")  R(θ,δ) .![{\displaystyle \ R(\theta ,\delta )\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/122583f7f2a94391d791a95f8008dde15ee3560a) usually specified as the integral of a [loss function](https://en.wikipedia.org/wiki/Loss_function "Loss function"). In this framework,  δ~ ![{\displaystyle \ {\tilde {\delta }}\ }](https://wikimedia.org/api/rest_v1/media/math/render/svg/c5085e0b92ae861c2ae2b0141e75cf296392b4d7)  is called **minimax** if it satisfies

supθR(θ,δ~)=infδ supθ R(θ,δ) .![{\displaystyle \sup _{\theta }R(\theta ,{\tilde {\delta }})=\inf _{\delta }\ \sup _{\theta }\ R(\theta ,\delta )\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/853be7f4311be94863637b4c9dc3534d0926e52f)

An alternative criterion in the decision theoretic framework is the [Bayes estimator](https://en.wikipedia.org/wiki/Bayes_estimator "Bayes estimator") in the presence of a [prior distribution](https://en.wikipedia.org/wiki/Prior_distribution "Prior distribution") Π .![{\displaystyle \Pi \ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/fdb0718e98dc8b2318fdbb26053e69168b3dbe44) An estimator is Bayes if it minimizes the _[average](https://en.wikipedia.org/wiki/Average "Average")_ risk

∫ΘR(θ,δ) d⁡Π(θ) .![{\displaystyle \int _{\Theta }R(\theta ,\delta )\ \operatorname {d} \Pi (\theta )\ .}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9bfd3dc17a8577945b20013f95605e7dd18cc247)

### Non-probabilistic decision theory

A key feature of minimax decision making is being non-probabilistic: in contrast to decisions using [expected value](https://en.wikipedia.org/wiki/Expected_value "Expected value") or [expected utility](https://en.wikipedia.org/wiki/Expected_utility "Expected utility"), it makes no assumptions about the probabilities of various outcomes, just [scenario analysis](https://en.wikipedia.org/wiki/Scenario_analysis "Scenario analysis") of what the possible outcomes are. It is thus [robust](https://en.wiktionary.org/wiki/robust "wikt:robust") to changes in the assumptions, in contrast to these other decision techniques. Various extensions of this non-probabilistic approach exist, notably [minimax regret](https://en.wikipedia.org/wiki/Minimax_regret "Minimax regret") and [Info-gap decision theory](https://en.wikipedia.org/wiki/Info-gap_decision_theory "Info-gap decision theory").

Further, minimax only requires [ordinal measurement](https://en.wikipedia.org/wiki/Ordinal_measurement "Ordinal measurement") (that outcomes be compared and ranked), not _interval_ measurements (that outcomes include "how much better or worse"), and returns ordinal data, using only the modeled outcomes: the conclusion of a minimax analysis is: "this strategy is minimax, as the worst case is (outcome), which is less bad than any other strategy". Compare to expected value analysis, whose conclusion is of the form: "This strategy yields ℰ(X) = n ." Minimax thus can be used on ordinal data, and can be more transparent.


---

  

# Chase (algorithm)
  

From Wikipedia, the free encyclopedia

**The chase** is a simple [fixed-point algorithm](https://en.wikipedia.org/wiki/Fixed-point_iteration "Fixed-point iteration") testing and enforcing implication of data dependencies in [database systems](https://en.wikipedia.org/wiki/Database "Database"). It plays important roles in [database theory](https://en.wikipedia.org/wiki/Database_theory "Database theory") as well as in practice. It is used, directly or indirectly, on an everyday basis by people who design databases, and it is used in commercial systems to reason about the consistency and correctness of a data design.[_[citation needed](https://en.wikipedia.org/wiki/Wikipedia:Citation_needed "Wikipedia:Citation needed")_] New applications of the chase in meta-data management and data exchange are still being discovered.

The chase has its origins in two seminal papers of 1979, one by [Alfred V. Aho](https://en.wikipedia.org/wiki/Alfred_V._Aho "Alfred V. Aho"), [Catriel Beeri](https://en.wikipedia.org/w/index.php?title=Catriel_Beeri&action=edit&redlink=1 "Catriel Beeri (page does not exist)"), and [Jeffrey D. Ullman](https://en.wikipedia.org/wiki/Jeffrey_D._Ullman "Jeffrey D. Ullman")[[1]](https://en.wikipedia.org/wiki/Chase_\(algorithm\)#cite_note-1) and the other by [David Maier](https://en.wikipedia.org/wiki/David_Maier "David Maier"), [Alberto O. Mendelzon](https://en.wikipedia.org/wiki/Alberto_O._Mendelzon "Alberto O. Mendelzon"), and [Yehoshua Sagiv](https://en.wikipedia.org/wiki/Yehoshua_Sagiv "Yehoshua Sagiv").[[2]](https://en.wikipedia.org/wiki/Chase_\(algorithm\)#cite_note-2)

In its simplest application the chase is used for testing whether the [projection](https://en.wikipedia.org/wiki/Projection_\(relational_algebra\) "Projection (relational algebra)") of a [relation schema](https://en.wikipedia.org/wiki/Relation_schema "Relation schema") constrained by some [functional dependencies](https://en.wikipedia.org/wiki/Functional_dependency "Functional dependency") onto a given decomposition can be [recovered by rejoining the projections](https://en.wikipedia.org/wiki/Join_dependency "Join dependency"). Let _t_ be a tuple in πS1(R)⋈πS2(R)⋈...⋈πSk(R)![{\displaystyle \pi _{S_{1}}(R)\bowtie \pi _{S_{2}}(R)\bowtie ...\bowtie \pi _{S_{k}}(R)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/07e808e51661ac54af9af0c6a872049834dd0b80) where _R_ is a [relation](https://en.wikipedia.org/wiki/Relation_\(database\) "Relation (database)") and _F_ is a set of functional dependencies (FD). If tuples in _R_ are represented as _t1, ..., tk_, the join of the projections of each _ti_ should agree with _t_ on πSi(R)![{\displaystyle \pi _{S_{i}}(R)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9aaa0845d1935910ca2d9b5183a94d70f4296bec) where _i_ = 1, 2, ..., _k_. If _ti_ is not on πSi(R)![{\displaystyle \pi _{S_{i}}(R)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/9aaa0845d1935910ca2d9b5183a94d70f4296bec), the value is unknown.

The chase can be done by drawing a tableau (which is the same formalism used in [tableau query](https://en.wikipedia.org/w/index.php?title=Tableau_query&action=edit&redlink=1 "Tableau query (page does not exist)")). Suppose _R_ has [attributes](https://en.wikipedia.org/wiki/Attribute_\(computing\) "Attribute (computing)") _A, B, ..._ and components of _t_ are _a, b, ..._. For _ti_ use the same letter as _t_ in the components that are in S_i_ but subscript the letter with _i_ if the component is not in S_i_. Then, _ti_ will agree with _t_ if it is in S_i_ and will have a unique value otherwise.

The chase process is [confluent](https://en.wikipedia.org/wiki/Confluence_\(rewriting_system\) "Confluence (rewriting system)"). There exist implementations of the chase algorithm,[[3]](https://en.wikipedia.org/wiki/Chase_\(algorithm\)#cite_note-3) some of them are also open-source.[[4]](https://en.wikipedia.org/wiki/Chase_\(algorithm\)#cite_note-4)

## Example

Let _R_(_A_, _B_, _C_, _D_) be a relation schema known to obey the set of functional dependencies _F_ = {_A_→_B_, _B_→_C_, _CD→A_}. Suppose _R_ is decomposed into three relation schemas S1 = {_A_, _D_}, S2 = {_A_, _C_} and S3 = {_B_, _C_, _D_}. Determining whether this decomposition is lossless can be done by performing a chase as shown below.

The initial tableau for this decomposition is:

|_A_|_B_|_C_|_D_|
|---|---|---|---|
|_a_|_b1_|_c1_|_d_|
|_a_|_b2_|_c_|_d2_|
|_a3_|_b_|_c_|_d_|

The first row represents S1. The components for attributes _A_ and _D_ are unsubscripted and those for attributes _B_ and _C_ are subscripted with _i_ = 1. The second and third rows are filled in the same manner with S2 and S3 respectively.

The goal for this test is to use the given _F_ to prove that _t_ = (_a_, _b_, _c_, _d_) is really in _R_. To do so, the tableau can be chased by applying the FDs in _F_ to equate symbols in the tableau. A final tableau with a row that is the same as _t_ implies that any tuple _t_ in the join of the projections is actually a tuple of _R_.  
To perform the chase test, first decompose all FDs in _F_ so each FD has a single attribute on the right hand side of the "arrow". (In this example, _F_ remains unchanged because all of its FDs already have a single attribute on the right hand side: _F_ = {_A_→_B_, _B_→_C_, _CD_→_A_}.)

When equating two symbols, if one of them is unsubscripted, make the other be the same so that the final tableau can have a row that is exactly the same as _t_ = (_a_, _b_, _c_, _d_). If both have their own subscript, change either to be the other. However, to avoid confusion, all of the occurrences should be changed.  
First, apply _A_→_B_ to the tableau. The first row is (_a_, _b1_, _c1_, _d_) where _a_ is unsubscripted and _b1_ is subscripted with 1. Comparing the first row with the second one, change _b2_ to _b1_. Since the third row has _a3_, _b_ in the third row stays the same. The resulting tableau is:

|_A_|_B_|_C_|_D_|
|---|---|---|---|
|_a_|_b1_|_c1_|_d_|
|_a_|_b1_|_c_|_d2_|
|_a3_|_b_|_c_|_d_|

Then consider _B_→_C_. Both first and second rows have _b1_ and notice that the second row has an unsubscripted _c_. Therefore, the first row changes to (_a_, _b1_, _c_, _d_). Then the resulting tableau is:

|_A_|_B_|_C_|_D_|
|---|---|---|---|
|_a_|_b1_|_c_|_d_|
|_a_|_b1_|_c_|_d2_|
|_a3_|_b_|_c_|_d_|

Now consider _CD_→_A_. The first row has an unsubscripted _c_ and an unsubscripted _d_, which is the same as in third row. This means that the A value for row one and three must be the same as well. Hence, change _a3_ in the third row to _a_. The resulting tableau is:

|_A_|_B_|_C_|_D_|
|---|---|---|---|
|_a_|_b1_|_c_|_d_|
|_a_|_b1_|_c_|_d2_|
|_a_|_b_|_c_|_d_|

At this point, notice that the third row is (_a_, _b_, _c_, _d_) which is the same as _t_. Therefore, this is the final tableau for the chase test with given _R_ and _F_. Hence, whenever _R_ is projected onto S1, S2 and S3 and rejoined, the result is in _R_. Particularly, the resulting tuple is the same as the tuple of _R_ that is projected onto {_B_, _C_, _D_}.

## References

1.  [Alfred V. Aho](https://en.wikipedia.org/wiki/Alfred_V._Aho "Alfred V. Aho"), [Catriel Beeri](https://en.wikipedia.org/w/index.php?title=Catriel_Beeri&action=edit&redlink=1 "Catriel Beeri (page does not exist)"), and [Jeffrey D. Ullman](https://en.wikipedia.org/wiki/Jeffrey_D._Ullman "Jeffrey D. Ullman"): "The Theory of Joins in Relational Databases", ACM Trans. Datab. Syst. 4(3):297-314, 1979.
2.  [David Maier](https://en.wikipedia.org/wiki/David_Maier "David Maier"), [Alberto O. Mendelzon](https://en.wikipedia.org/wiki/Alberto_O._Mendelzon "Alberto O. Mendelzon"), and [Yehoshua Sagiv](https://en.wikipedia.org/wiki/Yehoshua_Sagiv "Yehoshua Sagiv"): "Testing Implications of Data Dependencies". ACM Trans. Datab. Syst. 4(4):455-469, 1979.
3.  [Michael Benedikt](https://en.wikipedia.org/w/index.php?title=Michael_Benedikt_\(computer_scientist\)&action=edit&redlink=1 "Michael Benedikt (computer scientist) (page does not exist)"), [George Konstantinidis](https://en.wikipedia.org/w/index.php?title=George_Konstantinidis&action=edit&redlink=1 "George Konstantinidis (page does not exist)"), [Giansalvatore Mecca](https://en.wikipedia.org/w/index.php?title=Giansalvatore_Mecca&action=edit&redlink=1 "Giansalvatore Mecca (page does not exist)"), [Boris Motik](https://en.wikipedia.org/w/index.php?title=Boris_Motik&action=edit&redlink=1 "Boris Motik (page does not exist)"), [Paolo Papotti](https://en.wikipedia.org/w/index.php?title=Paolo_Papotti&action=edit&redlink=1 "Paolo Papotti (page does not exist)"), [Donatello Santoro](https://en.wikipedia.org/w/index.php?title=Donatello_Santoro&action=edit&redlink=1 "Donatello Santoro (page does not exist)"), [Efthymia Tsamoura](https://en.wikipedia.org/w/index.php?title=Efthymia_Tsamoura&action=edit&redlink=1 "Efthymia Tsamoura (page does not exist)"): _Benchmarking the Chase_. In Proc. of PODS, 2017.
4.  ["The Llunatic Mapping and Cleaning Chase Engine"](https://github.com/donatellosantoro/Llunatic). 6 April 2021.

- [Serge Abiteboul](https://en.wikipedia.org/wiki/Serge_Abiteboul "Serge Abiteboul"), [Richard B. Hull](https://en.wikipedia.org/w/index.php?title=Richard_B._Hull&action=edit&redlink=1 "Richard B. Hull (page does not exist)"), [Victor Vianu](https://en.wikipedia.org/wiki/Victor_Vianu "Victor Vianu"): Foundations of Databases. Addison-Wesley, 1995.
- [A. V. Aho](https://en.wikipedia.org/wiki/Alfred_Aho "Alfred Aho"), C. Beeri, and [J. D. Ullman](https://en.wikipedia.org/wiki/Jeffrey_Ullman "Jeffrey Ullman"): _The Theory of Joins in Relational Databases_. ACM Transactions on Database Systems 4(3): 297-314, 1979.
- [J. D. Ullman](https://en.wikipedia.org/wiki/Jeffrey_Ullman "Jeffrey Ullman"): _Principles of Database and Knowledge-Base Systems, Volume I_. Computer Science Press, New York, 1988.
- [J. D. Ullman](https://en.wikipedia.org/wiki/Jeffrey_Ullman "Jeffrey Ullman"), [J. Widom](https://en.wikipedia.org/wiki/Jennifer_Widom "Jennifer Widom"): _A First Course in Database Systems_ (3rd ed.). pp. 96–99. Pearson Prentice Hall, 2008.
- [Michael Benedikt](https://en.wikipedia.org/w/index.php?title=Michael_Benedikt_\(computer_scientist\)&action=edit&redlink=1 "Michael Benedikt (computer scientist) (page does not exist)"), [George Konstantinidis](https://en.wikipedia.org/w/index.php?title=George_Konstantinidis&action=edit&redlink=1 "George Konstantinidis (page does not exist)"), [Giansalvatore Mecca](https://en.wikipedia.org/w/index.php?title=Giansalvatore_Mecca&action=edit&redlink=1 "Giansalvatore Mecca (page does not exist)"), [Boris Motik](https://en.wikipedia.org/w/index.php?title=Boris_Motik&action=edit&redlink=1 "Boris Motik (page does not exist)"), [Paolo Papotti](https://en.wikipedia.org/w/index.php?title=Paolo_Papotti&action=edit&redlink=1 "Paolo Papotti (page does not exist)"), [Donatello Santoro](https://en.wikipedia.org/w/index.php?title=Donatello_Santoro&action=edit&redlink=1 "Donatello Santoro (page does not exist)"), [Efthymia Tsamoura](https://en.wikipedia.org/w/index.php?title=Efthymia_Tsamoura&action=edit&redlink=1 "Efthymia Tsamoura (page does not exist)"): _Benchmarking the Chase_. In Proc. of PODS, 2017.

## Further reading

- Sergio Greco; Francesca Spezzano; Cristian Molinaro (2012). _Incomplete Data and Data Dependencies in Relational Databases_. Morgan & Claypool Publishers. [ISBN](https://en.wikipedia.org/wiki/ISBN_\(identifier\) "ISBN (identifier)") [978-1-60845-926-1](https://en.wikipedia.org/wiki/Special:BookSources/978-1-60845-926-1 "Special:BookSources/978-1-60845-926-1").

[Categories](https://en.wikipedia.org/wiki/Help:Category "Help:Category"): 

- [Database theory](https://en.wikipedia.org/wiki/Category:Database_theory "Category:Database theory")
- [Database algorithms](https://en.wikipedia.org/wiki/Category:Database_algorithms "Category:Database algorithms")

- This page was last edited on 29 October 2025, at 09:50 (UTC).
- Text is available under the [Creative Commons Attribution-ShareAlike 4.0 License](https://en.wikipedia.org/wiki/Wikipedia:Text_of_the_Creative_Commons_Attribution-ShareAlike_4.0_International_License "Wikipedia:Text of the Creative Commons Attribution-ShareAlike 4.0 International License"); additional terms may apply. By using this site, you agree to the [Terms of Use](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use "foundation:Special:MyLanguage/Policy:Terms of Use") and [Privacy Policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy "foundation:Special:MyLanguage/Policy:Privacy policy"). Wikipedia® is a registered trademark of the [Wikimedia Foundation, Inc.](https://wikimediafoundation.org/), a non-profit organization.

- [Privacy policy](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy)
- [About Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:About)
- [Disclaimers](https://en.wikipedia.org/wiki/Wikipedia:General_disclaimer)
- [Contact Wikipedia](https://en.wikipedia.org/wiki/Wikipedia:Contact_us)
- [Legal & safety contacts](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Legal:Wikimedia_Foundation_Legal_and_Safety_Contact_Information)
- [Code of Conduct](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Universal_Code_of_Conduct)
- [Developers](https://developer.wikimedia.org/)
- [Statistics](https://stats.wikimedia.org/#/en.wikipedia.org)
- [Cookie statement](https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Cookie_statement)
- [Mobile view](https://en.wikipedia.org/w/index.php?title=Chase_\(algorithm\)&mobileaction=toggle_view_mobile)

- [![Wikimedia Foundation](https://en.wikipedia.org/static/images/footer/wikimedia.svg)](https://www.wikimedia.org/)
- [![Powered by MediaWiki](https://en.wikipedia.org/w/resources/assets/mediawiki_compact.svg)](https://www.mediawiki.org/)

---


SWRL has the full power of OWL DL, but at the price of decidability and practical implementations.[[4]](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language#cite_note-Parsia2005-4) However, decidability can be regained by restricting the form of admissible rules, typically by imposing a suitable safety condition.[[5]](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language#cite_note-Motik2005-5)

Rules are of the form of an implication between an antecedent (body) and a consequent (head). The intended meaning can be read as: whenever the conditions specified in the antecedent hold, then the conditions specified in the consequent must also hold. Both the antecedent and the consequent are composed of conjunctions of _atoms_. The basic atom forms are:[[1]](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language#cite_note-SWRL-spec-1)

- **C(x)** — a class description atom, asserting that individual _x_ belongs to class _C_
- **P(x, y)** — a property atom, asserting that individual _x_ is related to individual _y_ (or a data value) by property _P_
- **sameAs(x, y)** and **differentFrom(x, y)** — identity atoms

The specification notes that the `sameAs` and `differentFrom` atoms do not increase the expressivity of the language, since OWL together with rules (without these atoms) is already capable of the same expressions.[[1]](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language#cite_note-SWRL-spec-1)

## Example

### Human Readable Syntax

hasParent(?x1,?x2) ∧ hasBrother(?x2,?x3) ⇒ hasUncle(?x1,?x3)