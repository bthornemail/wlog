### 3.271 Pathname

A string that is used to identify a file. In the context of POSIX.1-2017, a pathname may be limited to {PATH_MAX} bytes, including the terminating null byte. It has optional beginning <slash> characters, followed by zero or more filenames separated by <slash> characters. A pathname can optionally contain one or more trailing <slash> characters. Multiple successive <slash> characters are considered to be the same as one <slash>, except for the case of exactly two leading <slash> characters.

**Note:**

If a pathname consists of only bytes corresponding to characters from the portable filename character set (see [Portable Filename Character Set](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_282)), <slash> characters, and a single terminating <NUL> character, the pathname will be usable as a character string in all supported locales; otherwise, the pathname might only be a string (rather than a character string). Additionally, since the single-byte encoding of the <slash> character is required to be the same across all locales and to not occur within a multi-byte character, references to a <slash> character within a pathname are well-defined even when the pathname is not a character string. However, this property does not necessarily hold for the remaining characters within the portable filename character set.

Pathname Resolution is defined in detail in [_Pathname Resolution_](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_13).

### 3.272 Pathname Component

See _Filename_ in [Filename](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_170).

### 3.273 Path Prefix

The part of a pathname up to, but not including, the last component and any trailing <slash> characters, unless the pathname consists entirely of <slash> characters, in which case the path prefix is '/' for a pathname containing either a single <slash> or three or more <slash> characters, and '//' for the pathname **//**. The path prefix of a pathname containing no <slash> characters is empty, but is treated as referring to the current working directory.

**Note:**

The term is used both in the sense of identifying part of a pathname that forms the prefix and of joining a non-empty path prefix to a filename to form a pathname. In the latter case, the path prefix need not have a trailing <slash> (in which case the joining is done with a <slash> character).

### 3.274 Pattern

A sequence of characters used either with regular expression notation or for pathname expansion, as a means of selecting various character strings or pathnames, respectively.

**Note:**

Regular Expressions are defined in detail in [_Regular Expressions_](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap09.html#tag_09).

See also XCU [_Pathname Expansion_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_06_06).

The syntaxes of the two types of patterns are similar, but not identical; POSIX.1-2017 always indicates the type of pattern being referred to in the immediate context of the use of the term.

### 3.275 Period Character (<period>)

The character '.'. The term "period" is contrasted with dot (see also [Dot](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_136)), which is used to describe a specific directory entry.

### 3.276 Permissions

Attributes of an object that determine the privilege necessary to access or manipulate the object.

**Note:**

File Access Permissions are defined in detail in [_File Access Permissions_](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_05).

### 3.277 Persistence

A mode for semaphores, shared memory, and message queues requiring that the object and its state (including data, if any) are preserved after the object is no longer referenced by any process.

Persistence of an object does not imply that the state of the object is maintained across a system crash or a system reboot.

### 3.278 Pipe

An object identical to a FIFO which has no links in the file hierarchy.

**Note:**

The [_pipe_()](https://pubs.opengroup.org/onlinepubs/9699919799/functions/pipe.html) function is defined in detail in the System Interfaces volume of POSIX.1-2017.

### 3.279 Polling

A scheduling scheme whereby the local process periodically checks until the pre-specified events (for example, read, write) have occurred.

### 3.280 Portable Character Set

The collection of characters that are required to be present in all locales supported by conforming systems.

**Note:**

The Portable Character Set is defined in detail in [_Portable Character Set_](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap06.html#tag_06_01).

This term is contrasted against the smaller portable filename character set; see also [Portable Filename Character Set](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_282).

### 3.281 Portable Filename

A filename consisting only of characters from the portable filename character set.

**Note:**

Applications should avoid using filenames that have the <hyphen-minus> character as the first character since this may cause problems when filenames are passed as command line arguments.

### 3.282 Portable Filename Character Set

The set of characters from which portable filenames are constructed.

A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
a b c d e f g h i j k l m n o p q r s t u v w x y z
0 1 2 3 4 5 6 7 8 9 . _ -

The last three characters are the <period>, <underscore>, and <hyphen-minus> characters, respectively. See also [Pathname](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_271).

### 3.317 Redirection

In the shell command language, a method of associating files with the input or output of commands.

**Note:**

For further information, see XCU [_Redirection_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_07).

### 3.318 Redirection Operator

In the shell command language, a token that performs a redirection function. It is one of the following symbols:

<     >     >|     <<     >>     <&     >&     <<-     <>


### 3.359 Source Code

When dealing with the Shell Command Language, input to the command language interpreter. The term "shell script" is synonymous with this meaning.

When dealing with an ISO/IEC-conforming programming language, source code is input to a compiler conforming to that ISO/IEC standard.

Source code also refers to the input statements prepared for the following standard utilities: [_awk_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/awk.html), [_bc_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/bc.html), [_ed_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ed.html), [_ex_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ex.html), [_lex_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/lex.html), [_localedef_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/localedef.html), [_make_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/make.html), [_sed_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html), and [_yacc_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/yacc.html).

Source code can also refer to a collection of sources meeting any or all of these meanings.

**Note:**

The [_awk_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/awk.html), [_bc_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/bc.html), [_ed_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ed.html), [_ex_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/ex.html), [_lex_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/lex.html), [_localedef_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/localedef.html), [_make_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/make.html), [_sed_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/sed.html), and [_yacc_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/yacc.html) utilities are defined in detail in the Shell and Utilities volume of POSIX.1-2017.

### 3.360 Space Character (<space>)

The character defined in the portable character set as <space>. The <space> character is a member of the **space** character class of the current locale, but represents the single character, and not all of the possible members of the class; see also [White Space](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_442).

### 3.361 Spawn

A process creation primitive useful for systems that have difficulty with [_fork_()](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fork.html) and as an efficient replacement for [_fork_()](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fork.html)/ _exec_.

### 3.362 Special Built-In

See _Built-In Utility_ in [Built-In Utility (or Built-In)](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_83).

### 3.363 Special Parameter

In the shell command language, a parameter named by a single character from the following list:

*   @   #   ?   !   -   $   0

**Note:**

For further information, see XCU [_Special Parameters_](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_05_02). 

## Computer representations

In [computing](https://en.wikipedia.org/wiki/Computing "Computing"), several ellipsis [characters](https://en.wikipedia.org/wiki/Character_\(computing\) "Character (computing)") have been codified.

### Unicode

[Unicode](https://en.wikipedia.org/wiki/Unicode "Unicode") defines the following ellipsis characters:

- U+2026 … HORIZONTAL ELLIPSIS
- U+0EAF ຯ LAO ELLIPSIS
- U+1801 ᠁ MONGOLIAN ELLIPSIS
- U+0E2F ฯ THAI CHARACTER PAIYANNOI
- U+22EE ⋮ VERTICAL ELLIPSIS
- U+22EF ⋯ MIDLINE HORIZONTAL ELLIPSIS
- U+22F0 ⋰ UP RIGHT DIAGONAL ELLIPSIS
- U+22F1 ⋱ DOWN RIGHT DIAGONAL ELLIPSIS
- U+FE19 ︙ PRESENTATION FORM FOR VERTICAL HORIZONTAL ELLIPSIS

Unicode recognizes a series of three [period](https://en.wikipedia.org/wiki/Full_stop "Full stop") characters (U+002E . FULL STOP) as [compatibility equivalent](https://en.wikipedia.org/wiki/Unicode_equivalence "Unicode equivalence") (though not canonical) to the horizontal ellipsis character.[[48]](https://en.wikipedia.org/wiki/Ellipsis#cite_note-48)

### HTML

In [HTML](https://en.wikipedia.org/wiki/HTML "HTML"), the horizontal ellipsis character may be represented by the entity reference `&hellip;` (since HTML 4.0), and the vertical ellipsis character by the entity reference `&vellip;` (since HTML 5.0).[[49]](https://en.wikipedia.org/wiki/Ellipsis#cite_note-49) Alternatively, in HTML, [XML](https://en.wikipedia.org/wiki/XML "XML"), and [SGML](https://en.wikipedia.org/wiki/SGML "SGML"), a [numeric character reference](https://en.wikipedia.org/wiki/Numeric_character_reference "Numeric character reference") such as `&#x2026;` or `&#8230;` can be used.

Many user interfaces provide [disclosure widgets](https://en.wikipedia.org/wiki/Disclosure_widget "Disclosure widget") for code folding in a sidebar, indicated for example by a triangle that points sideways (if collapsed) or down (if expanded), or by a `[-]` box for collapsible (expanded) text, and a `[+]` box for expandable (collapsed) text.

### Token-based

Token-based folding points are specified using special [delimiters](https://en.wikipedia.org/wiki/Delimiter "Delimiter") that serve no other purpose in the text than to identify the boundaries of folding points. This convention can be compared to indentation-based folding points, where printable characters are used instead of whitespace. The most common delimiter tokens are `{{{` to begin the folded section, and `}}}` to end it.

These are U+2024 ONE DOT LEADER (․), U+2025 TWO DOT LEADER (‥), and U+2026 HORIZONTAL [ELLIPSIS](https://en.wikipedia.org/wiki/Ellipsis "Ellipsis") (…), a three dot leader.[[3]](https://en.wikipedia.org/wiki/Leader_\(typography\)#cite_note-3)


|   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|
|( )|U+0028 U+0029|&#40; &#41;<br><br>&lpar;  <br>&rpar;|( )![{\displaystyle (~)}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ab3f9fb76967e95a9bf2d9e6b2a9180f27a0e817) ( )|[precedence grouping](https://en.wikipedia.org/wiki/Precedence_grouping "Precedence grouping")|parentheses; brackets|almost all logic syntaxes, as well as metalanguage|Perform the operations inside the parentheses first.|(8 ÷ 4) ÷ 2 = 2 ÷ 2 = 1, but 8 ÷ (4 ÷ 2) = 8 ÷ 2 = 4.|

|   |   |   |   |   |   |   |   |   |
|---|---|---|---|---|---|---|---|---|
|∴|U+2234||∴\therefore|[therefore](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign")|[therefore](https://en.wikipedia.org/wiki/Therefore_sign "Therefore sign")|[metalanguage](https://en.wikipedia.org/wiki/Metalanguage "Metalanguage")|abbreviation for “therefore”.||
|∵|U+2235||∵\because|[because](https://en.wikipedia.org/wiki/Therefore_sign#Similar_signs "Therefore sign")|[because](https://en.wikipedia.org/wiki/Therefore_sign#Similar_signs "Therefore sign")|[metalanguage](https://en.wikipedia.org/wiki/Metalanguage "Metalanguage")|abbreviation for “because”.||

### Character set

The basic C source character set includes the following characters:[[38]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-draft2007-43)

- Lowercase and uppercase letters of the [ISO basic Latin alphabet](https://en.wikipedia.org/wiki/ISO_basic_Latin_alphabet "ISO basic Latin alphabet"): `a`–`z`, `A`–`Z`
- Decimal digits: `0`–`9`
- Graphic characters: `! " # % & ' ( ) * + , - . / : ; < = > ? [ \ ] ^ _ { | } ~`
- [Whitespace characters](https://en.wikipedia.org/wiki/Whitespace_character "Whitespace character"): _[space](https://en.wikipedia.org/wiki/Space_\(punctuation\) "Space (punctuation)")_, _[horizontal tab](https://en.wikipedia.org/wiki/Horizontal_tab "Horizontal tab")_, _[vertical tab](https://en.wikipedia.org/wiki/Vertical_tab "Vertical tab")_, _[form feed](https://en.wikipedia.org/wiki/Form_feed "Form feed")_, _[newline](https://en.wikipedia.org/wiki/Newline "Newline")_

The _newline_ character indicates the end of a text line; it need not correspond to an actual single character, although for convenience C treats it as such.

The POSIX standard mandates a [portable character set](https://en.wikipedia.org/wiki/Portable_character_set "Portable character set") which adds a few characters (notably "@") to the basic C source character set. Both standards do not prescribe any particular value encoding—[ASCII](https://en.wikipedia.org/wiki/ASCII "ASCII") and [EBCDIC](https://en.wikipedia.org/wiki/EBCDIC "EBCDIC") both comply with these standards, since they include at least those basic characters, even though they use different encoded values for those characters.

Additional multi-byte encoded characters may be used in [string literals](https://en.wikipedia.org/wiki/String_literal "String literal"), but they are not entirely [portable](https://en.wikipedia.org/wiki/Software_portability "Software portability"). Since [C99](https://en.wikipedia.org/wiki/C99 "C99") multi-national Unicode characters can be embedded portably within C source text by using `\uXXXX` or `\UXXXXXXXX` encoding (where `X` denotes a hexadecimal character).

The basic C execution character set contains the same characters, along with representations for the [null character](https://en.wikipedia.org/wiki/Null_character "Null character"), [alert](https://en.wikipedia.org/wiki/Bell_character "Bell character"), [backspace](https://en.wikipedia.org/wiki/Backspace "Backspace"), and [carriage return](https://en.wikipedia.org/wiki/Carriage_return "Carriage return").[[38]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-draft2007-43)

[Run-time](https://en.wikipedia.org/wiki/Run_time_\(program_lifecycle_phase\) "Run time (program lifecycle phase)") support for extended character sets has increased with each revision of the C standard.

### Reserved words

All versions of C have [reserved words](https://en.wikipedia.org/wiki/Reserved_words "Reserved words") that are [case sensitive](https://en.wikipedia.org/wiki/Case_sensitive "Case sensitive"). As reserved words, they cannot be used for variable names.

C89 has 32 reserved words:

- `auto`
- `[break](https://en.wikipedia.org/wiki/Break_statement "Break statement")`
- `case`
- `char`
- `[const](https://en.wikipedia.org/wiki/Const "Const")`
- `[continue](https://en.wikipedia.org/wiki/Continue_\(keyword\) "Continue (keyword)")`
- `default`
- `do`
- `[double](https://en.wikipedia.org/wiki/Double-precision_floating-point_format "Double-precision floating-point format")`
- `[else](https://en.wikipedia.org/wiki/Conditional_\(computer_programming\) "Conditional (computer programming)")`
- `[enum](https://en.wikipedia.org/wiki/Enumerated_type "Enumerated type")`
- `[extern](https://en.wikipedia.org/wiki/Extern "Extern")`
- `[float](https://en.wikipedia.org/wiki/Floating-point_arithmetic "Floating-point arithmetic")`
- `[for](https://en.wikipedia.org/wiki/For_loop "For loop")`
- `[goto](https://en.wikipedia.org/wiki/Goto "Goto")`
- `[if](https://en.wikipedia.org/wiki/Conditional_\(computer_programming\) "Conditional (computer programming)")`
- `[int](https://en.wikipedia.org/wiki/Integer_\(computer_science\) "Integer (computer science)")`
- `[long](https://en.wikipedia.org/wiki/Long_integer "Long integer")`
- `[register](https://en.wikipedia.org/wiki/Register_\(keyword\) "Register (keyword)")`
- `[return](https://en.wikipedia.org/wiki/Return_statement "Return statement")`
- `[short](https://en.wikipedia.org/wiki/Short_integer "Short integer")`
- `[signed](https://en.wikipedia.org/wiki/Signed_number_representations "Signed number representations")`
- `[sizeof](https://en.wikipedia.org/wiki/Sizeof "Sizeof")`
- `[static](https://en.wikipedia.org/wiki/Static_\(keyword\) "Static (keyword)")`
- `[struct](https://en.wikipedia.org/wiki/Struct_\(C_programming_language\) "Struct (C programming language)")`
- `[switch](https://en.wikipedia.org/wiki/Switch_statement "Switch statement")`
- `[typedef](https://en.wikipedia.org/wiki/Typedef "Typedef")`
- `[union](https://en.wikipedia.org/wiki/Union_type "Union type")`
- `[unsigned](https://en.wikipedia.org/wiki/Signed_number_representations "Signed number representations")`
- `[void](https://en.wikipedia.org/wiki/Void_type "Void type")`
- `[volatile](https://en.wikipedia.org/wiki/Volatile_variable "Volatile variable")`
- `[while](https://en.wikipedia.org/wiki/While_loop "While loop")`

C99 added five more reserved words: (‡ indicates an alternative spelling alias for a C23 keyword)

- `[inline](https://en.wikipedia.org/wiki/Inline_function "Inline function")`
- `[restrict](https://en.wikipedia.org/wiki/Restrict "Restrict")`
- `_Bool` ‡
- `[_Complex](https://en.wikipedia.org/wiki/Complex_data_type "Complex data type")`
- `[_Imaginary](https://en.wikipedia.org/wiki/Complex_data_type "Complex data type")`

C11 added seven more reserved words:[[39]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-ISOIEC_9899-44) (‡ indicates an alternative spelling alias for a C23 keyword)

- `_Alignas` ‡
- `_Alignof` ‡
- `_Atomic`
- `_Generic`
- `_Noreturn`
- `_Static_assert` ‡
- `_Thread_local` ‡

C23 reserved fifteen more words:

- `alignas`
- `alignof`
- `bool`
- `constexpr`
- `false`
- `nullptr`
- `static_assert`
- `thread_local`
- `true`
- `typeof`
- `typeof_unqual`
- `_BitInt`
- `_Decimal32`
- `_Decimal64`
- `_Decimal128`

Most of the recently reserved words begin with an underscore followed by a capital letter, because identifiers of that form were previously reserved by the C standard for use only by implementations. Since existing program source code should not have been using these identifiers, it would not be affected when C implementations started supporting these extensions to the programming language. Some standard headers do define more convenient synonyms for underscored identifiers. Some of those words were added as keywords with their conventional spelling in C23 and the corresponding macros were removed.

Prior to C89, `entry` was reserved as a keyword. In the second edition of their book _[The C Programming Language](https://en.wikipedia.org/wiki/The_C_Programming_Language "The C Programming Language")_, which describes what became known as C89, Kernighan and Ritchie wrote, "The ... [keyword] `entry`, formerly reserved but never used, is no longer reserved." and "The stillborn `entry` keyword is withdrawn."[[40]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-FOOTNOTEKernighanRitchie1988192,_259-45)

### Operators

Main article: [Operators in C and C++](https://en.wikipedia.org/wiki/Operators_in_C_and_C%2B%2B "Operators in C and C++")

C supports a rich set of [operators](https://en.wikipedia.org/wiki/Operator_\(computer_programming\) "Operator (computer programming)"), which are symbols used within an [expression](https://en.wikipedia.org/wiki/Expression_\(computer_science\) "Expression (computer science)") to specify the manipulations to be performed while evaluating that expression. C has operators for:

- [arithmetic](https://en.wikipedia.org/wiki/Arithmetic "Arithmetic"): [`+`](https://en.wikipedia.org/wiki/Addition "Addition"), [`-`](https://en.wikipedia.org/wiki/Subtraction "Subtraction"), [`*`](https://en.wikipedia.org/wiki/Multiplication "Multiplication"), [`/`](https://en.wikipedia.org/wiki/Division_\(mathematics\) "Division (mathematics)"), [`%`](https://en.wikipedia.org/wiki/Modulo_operation "Modulo operation")
- [assignment](https://en.wikipedia.org/wiki/Assignment_\(computer_science\) "Assignment (computer science)"): `=`
- [augmented assignment](https://en.wikipedia.org/wiki/Augmented_assignment "Augmented assignment"): `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`
- [bitwise logic](https://en.wikipedia.org/wiki/Bitwise_logic "Bitwise logic"): `~`, `&`, `|`, `^`
- [bitwise shifts](https://en.wikipedia.org/wiki/Bitwise_shift "Bitwise shift"): `<<`, `>>`
- [Boolean logic](https://en.wikipedia.org/wiki/Boolean_logic "Boolean logic"): `!`, `&&`, `||`
- [conditional evaluation](https://en.wikipedia.org/wiki/%3F: "?:"): [`? :`](https://en.wikipedia.org/wiki/%3F: "?:")
- equality testing: [`==`](https://en.wikipedia.org/wiki/Equality_\(mathematics\) "Equality (mathematics)"), [`!=`](https://en.wikipedia.org/wiki/Inequality_\(mathematics\) "Inequality (mathematics)")
- [calling functions](https://en.wikipedia.org/wiki/Subroutine "Subroutine"): `( )`
- [increment and decrement](https://en.wikipedia.org/wiki/Increment_and_decrement_operators "Increment and decrement operators"): `++`, `--`
- [member selection](https://en.wikipedia.org/wiki/Record_\(computer_science\) "Record (computer science)"): `.`, `->`
- object size: `[sizeof](https://en.wikipedia.org/wiki/Sizeof "Sizeof")`
- type: `[typeof](https://en.wikipedia.org/wiki/Typeof "Typeof")`, `typeof_unqual` _since C23_
- [order relations](https://en.wikipedia.org/wiki/Order_relation "Order relation"): `<`, `<=`, `>`, `>=`
- [reference and dereference](https://en.wikipedia.org/wiki/Pointer_\(computer_programming\) "Pointer (computer programming)"): `&`, `*`, `[ ]`
- sequencing: [`,`](https://en.wikipedia.org/wiki/Comma_operator "Comma operator")
- [subexpression grouping](https://en.wikipedia.org/wiki/Order_of_operations#Programming_languages "Order of operations"): `( )`
- [type conversion](https://en.wikipedia.org/wiki/Type_conversion "Type conversion"): `(_typename_)`

C uses the operator `=` (used in mathematics to express equality) to indicate assignment, following the precedent of [Fortran](https://en.wikipedia.org/wiki/Fortran "Fortran") and [PL/I](https://en.wikipedia.org/wiki/PL/I "PL/I"), but unlike [ALGOL](https://en.wikipedia.org/wiki/ALGOL "ALGOL") and its derivatives. C uses the operator `==` to test for equality. The similarity between the operators for assignment and equality may result in the accidental use of one in place of the other, and in many cases the mistake does not produce an error message (although some compilers produce warnings). For example, the conditional expression `if (a == b + 1)` might mistakenly be written as `if (a = b + 1)`, which will be evaluated as `true` unless the value of `a` is `0` after the assignment.[[41]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-AutoTX-8-46)

The C [operator precedence](https://en.wikipedia.org/wiki/Operator_precedence "Operator precedence") is not always intuitive. For example, the operator `==` binds more tightly than (is executed prior to) the operators `&` (bitwise AND) and `|` (bitwise OR) in expressions such as `x & 1 == 0`, which must be written as `(x & 1) == 0` if that is the coder's intent.[[42]](https://en.wikipedia.org/wiki/C_\(programming_language\)#cite_note-AutoTX-9-47)

---


## Standard

**For consistency use the following preferred symbols and terminology in Logic articles**

It is useful to have an agreed set of symbols and terminology. Not only do symbols vary from author to author, but any symbol may be written in a variety of fonts which may or may not appear on various browsers. The aim is consistency and legibility

## Symbols

For consistency use the following preferred symbols in Logic articles:

### Truth Functional Connectives

|Connective|Name|Symbol(s)|Preferred Symbol(s)|Template|<math>|See|
|---|---|---|---|---|---|---|
|Negation|NOT|¬ or ¬![{\displaystyle \neg }](https://wikimedia.org/api/rest_v1/media/math/render/svg/fa78fd02085d39aa58c9e47a6d4033ce41e02fad) or ~|¬![{\displaystyle \neg }](https://wikimedia.org/api/rest_v1/media/math/render/svg/fa78fd02085d39aa58c9e47a6d4033ce41e02fad)|**{{[not](https://en.wikipedia.org/wiki/Template:Not "Template:Not")}}**|\neg|[Logical negation](https://en.wikipedia.org/wiki/Logical_negation "Logical negation")|
|Conjunction|AND|∧![{\displaystyle \wedge }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1caa4004cb216ef2930bb12fe805a76870caed94) or &|∧![{\displaystyle \wedge }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1caa4004cb216ef2930bb12fe805a76870caed94)|**{{[and](https://en.wikipedia.org/wiki/Template:And "Template:And")}}**|\And|[Logical conjunction](https://en.wikipedia.org/wiki/Logical_conjunction "Logical conjunction")|
|Inclusive disjunction|OR|∨![{\displaystyle \vee }](https://wikimedia.org/api/rest_v1/media/math/render/svg/7b76220c6805c9b465d6efbc7686c624f49f3023)|∨![{\displaystyle \lor }](https://wikimedia.org/api/rest_v1/media/math/render/svg/ab47f6b1f589aedcf14638df1d63049d233d851a)|**{{[or-](https://en.wikipedia.org/wiki/Template:Or- "Template:Or-")}}**|\vee|[Logical disjunction](https://en.wikipedia.org/wiki/Logical_disjunction "Logical disjunction")|
|Material implication|IMPLIES|→![{\displaystyle \rightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/53e574cc3aa5b4bf5f3f5906caf121a378eef08b) or ⇒![{\displaystyle \Rightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/469b737d167b9b28a74e27c7f5e35b5ea9256100) or ⊃![{\displaystyle \supset }](https://wikimedia.org/api/rest_v1/media/math/render/svg/27bfe0828a2ed4c9c6b70987a85c02a1f005843c) or →![{\displaystyle \to }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1daab843254cfcb23a643070cf93f3badc4fbbbd)|→![{\displaystyle \to }](https://wikimedia.org/api/rest_v1/media/math/render/svg/1daab843254cfcb23a643070cf93f3badc4fbbbd)|**{{[imp](https://en.wikipedia.org/wiki/Template:Imp "Template:Imp")}}**|\rightarrow|[Material conditional](https://en.wikipedia.org/wiki/Material_conditional "Material conditional")|
|Material equivalence (biconditional)|EQV or XNOR|↔![{\displaystyle \leftrightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/046b918c43e05caf6624fe9b676c69ec9cd6b892) or ⇔![{\displaystyle \Leftrightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/64812e13399c20cf3ce94e049d3bb2d85f26abcf) or = or ≡![{\displaystyle \equiv }](https://wikimedia.org/api/rest_v1/media/math/render/svg/4c5c34250859b6f6d2a77b4e8a2ceaa90638076d) (for definitions, := or :≡![{\displaystyle \equiv }](https://wikimedia.org/api/rest_v1/media/math/render/svg/4c5c34250859b6f6d2a77b4e8a2ceaa90638076d) may be used)|↔![{\displaystyle \leftrightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/046b918c43e05caf6624fe9b676c69ec9cd6b892)|**{{[eqv](https://en.wikipedia.org/wiki/Template:Eqv "Template:Eqv")}}**|\leftrightarrow|[Logical biconditional](https://en.wikipedia.org/wiki/Logical_biconditional "Logical biconditional"), [Logical equality](https://en.wikipedia.org/wiki/Logical_equality "Logical equality"), [Logical equivalence](https://en.wikipedia.org/wiki/Logical_equivalence "Logical equivalence")|
|Neither-nor (joint denial)|NOR|↓![{\displaystyle \downarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/4618f22b0f780805eb94bb407578d9bc9487947a) or  **↓**|↓![{\displaystyle \downarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/4618f22b0f780805eb94bb407578d9bc9487947a)|**{{[nor-](https://en.wikipedia.org/wiki/Template:Nor- "Template:Nor-")}}**|\downarrow|[Logical NOR](https://en.wikipedia.org/wiki/Logical_NOR "Logical NOR")|
|Not both (alternative denial)|NAND|↑![{\displaystyle \uparrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/ddb20b28c74cdaa09e1f101d426441da1996072f)|↑![{\displaystyle \uparrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/ddb20b28c74cdaa09e1f101d426441da1996072f)|**{{[nand](https://en.wikipedia.org/wiki/Template:Nand "Template:Nand")}}**|\uparrow|[Alternative denial (Nand)](https://en.wikipedia.org/wiki/Sheffer_stroke "Sheffer stroke")|
|Exclusive disjunction|XOR|↮![{\displaystyle \nleftrightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/dce85ed756bc5a6cdf0f62892f57a6a1f96803ac) or **+** or **⊕![{\displaystyle \oplus }](https://wikimedia.org/api/rest_v1/media/math/render/svg/8b16e2bdaefee9eed86d866e6eba3ac47c710f60)** or **≠**|↮![{\displaystyle \nleftrightarrow }](https://wikimedia.org/api/rest_v1/media/math/render/svg/dce85ed756bc5a6cdf0f62892f57a6a1f96803ac)|**{{[xor](https://en.wikipedia.org/wiki/Template:Xor "Template:Xor")}}**|\nleftrightarrow|[XOR](https://en.wikipedia.org/wiki/XOR "XOR")|

### Quantifiers

|Quantifier|Description|Symbols|Preferred Symbol|Template|<math>|
|---|---|---|---|---|---|
|Universal|For every x|(x) or ∀![{\displaystyle \forall }](https://wikimedia.org/api/rest_v1/media/math/render/svg/bfc1a1a9c4c0f8d5df989c98aa2773ed657c5937) _x_ or ∀x![{\displaystyle \forall x}](https://wikimedia.org/api/rest_v1/media/math/render/svg/1a3fa2fb002baecbc5038bd3dd42bab57448b315)|∀x![{\displaystyle \forall x}](https://wikimedia.org/api/rest_v1/media/math/render/svg/1a3fa2fb002baecbc5038bd3dd42bab57448b315)|**{{[all](https://en.wikipedia.org/wiki/Template:All "Template:All")}}**|\forall x|
|Existential|There exists an x|∃![{\displaystyle \exists }](https://wikimedia.org/api/rest_v1/media/math/render/svg/77ed842b6b90b2fdd825320cf8e5265fa937b583)_x_ or ∃x![{\displaystyle \exists x}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ab833914405cde960b3b9af3feaa9e4fef96ffa9)|∃x![{\displaystyle \exists x}](https://wikimedia.org/api/rest_v1/media/math/render/svg/ab833914405cde960b3b9af3feaa9e4fef96ffa9)|**{{[exist](https://en.wikipedia.org/wiki/Template:Exist "Template:Exist")}}**|\exists x|



---

## 2 [Directional Formatting Characters](https://unicode.org/reports/tr9/#Directional_Formatting_Characters)

Three types of explicit directional formatting characters are used to modify the standard implicit Unicode Bidirectional Algorithm (UBA). In addition, there are implicit directional formatting characters, the _right-to-left_ and _left-to-right_ marks. The effects of all of these formatting characters are limited to the current paragraph; thus, they are terminated by a _paragraph separator_.

These formatting characters all have the property _Bidi_Control_, and are divided into three groups:

|   |   |
|---|---|
|Implicit Directional Formatting Characters|LRM, RLM, ALM|
|Explicit Directional Embedding and Override Formatting Characters|LRE, RLE, LRO, RLO, PDF|
|Explicit Directional Isolate Formatting Characters|LRI, RLI, FSI, PDI|

Although the term _embedding_ is used for some explicit formatting characters, the text within the scope of the embedding formatting characters is not independent of the surrounding text. Characters within an embedding can affect the ordering of characters outside, and vice versa. This is not the case with the isolate formatting characters, however. Characters within an isolate cannot affect the ordering of characters outside it, or vice versa. The effect that an isolate as a whole has on the ordering of the surrounding characters is the same as that of a neutral character, whereas an embedding or override roughly has the effect of a strong character.

Directional isolate characters were introduced in Unicode 6.3 after it became apparent that directional embeddings usually have too strong an effect on their surroundings and are thus unnecessarily difficult to use. The new characters were introduced instead of changing the behavior of the existing ones because doing so might have had an undesirable effect on those existing documents that do rely on the old behavior. Nevertheless, the use of the directional isolates instead of embeddings is encouraged in new documents – once target platforms are known to support them.

On web pages, the _explicit_ directional formatting characters (of all types – embedding, override, and isolate) should be replaced by other mechanisms suitable for HTML and CSS. For information on the correspondence between explicit directional formatting characters and equivalent HTML5 markup and CSS properties, see _Section 2.7, [Markup and Formatting Characters](https://unicode.org/reports/tr9/#Markup_And_Formatting)_.

### 2.1 [Explicit Directional Embeddings](https://unicode.org/reports/tr9/#Explicit_Directional_Embeddings)

The following characters signal that a piece of text is to be treated as embedded. For example, an English quotation in the middle of an Arabic sentence could be marked as being embedded left-to-right text. If there were a Hebrew phrase in the middle of the English quotation, that phrase could be marked as being embedded right-to-left text. Embeddings can be nested one inside another, and in isolates and overrides.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**LRE**|U+202A|LEFT-TO-RIGHT EMBEDDING|Treat the following text as embedded left-to-right.|
|**RLE**|U+202B|RIGHT-TO-LEFT EMBEDDING|Treat the following text as embedded right-to-left.|

The effect of right-left line direction, for example, can be accomplished by embedding the text with RLE...PDF. (PDF will be described in _Section 2.3, [Terminating Explicit Directional Embeddings and Overrides](https://unicode.org/reports/tr9/#Terminating_Explicit_Directional_Embeddings_and_Overrides)_.)

### 2.2 [Explicit Directional Overrides](https://unicode.org/reports/tr9/#Explicit_Directional_Overrides)

The following characters allow the bidirectional character types to be overridden when required for special cases, such as for part numbers. They are to be avoided wherever possible, because of security concerns. For more information, see [[UTR36](https://www.unicode.org/reports/tr41/tr41-36.html#UTR36)]. Directional overrides can be nested one inside another, and in embeddings and isolates.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**LRO**|U+202D|LEFT-TO-RIGHT OVERRIDE|Force following characters to be treated as strong left-to-right characters.|
|**RLO**|U+202E|RIGHT-TO-LEFT OVERRIDE|Force following characters to be treated as strong right-to-left characters.|

The precise meaning of these characters will be made clear in the discussion of the algorithm. The right-to-left override, for example, can be used to force a part number made of mixed English, digits and Hebrew letters to be written from right to left.

### 2.3 [Terminating Explicit Directional Embeddings and Overrides](https://unicode.org/reports/tr9/#Terminating_Explicit_Directional_Embeddings_and_Overrides)[](https://unicode.org/reports/tr9/#Terminating_Explicit_Directional_Code)

The following character terminates the scope of the last LRE, RLE, LRO, or RLO whose scope has not yet been terminated.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**PDF**|U+202C|POP DIRECTIONAL FORMATTING|End the scope of the last LRE, RLE, RLO, or LRO.|

The precise meaning of this character will be made clear in the discussion of the algorithm.

### 2.4 [Explicit Directional Isolates](https://unicode.org/reports/tr9/#Explicit_Directional_Isolates)

The following characters signal that a piece of text is to be treated as directionally isolated from its surroundings. They are very similar to the explicit embedding formatting characters. However, while an embedding roughly has the effect of a strong character on the ordering of the surrounding text, an isolate has the effect of a neutral like U+FFFC OBJECT REPLACEMENT CHARACTER, and is assigned the corresponding display position in the surrounding text. Furthermore, the text inside the isolate has no effect on the ordering of the text outside it, and vice versa.

In addition to allowing the embedding of strongly directional text without unduly affecting the bidirectional order of its surroundings, one of the isolate formatting characters also offers an extra feature: embedding text while inferring its direction heuristically from its constituent characters.

Isolates can be nested one inside another, and in embeddings and overrides.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**LRI**|U+2066|LEFT‑TO‑RIGHT ISOLATE|Treat the following text as isolated and left-to-right.|
|**RLI**|U+2067|RIGHT‑TO‑LEFT ISOLATE|Treat the following text as isolated and right-to-left.|
|**FSI**|U+2068|FIRST STRONG ISOLATE|Treat the following text as isolated and in the direction of its first strong directional character that is not inside a nested isolate.|

The precise meaning of these characters will be made clear in the discussion of the algorithm.

### 2.5 [Terminating Explicit Directional Isolates](https://unicode.org/reports/tr9/#Terminating_Explicit_Directional_Isolates)

The following character terminates the scope of the last LRI, RLI, or FSI whose scope has not yet been terminated, as well as the scopes of any subsequent LREs, RLEs, LROs, or RLOs whose scopes have not yet been terminated.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**PDI**|U+2069|POP DIRECTIONAL ISOLATE|End the scope of the last LRI, RLI, or FSI.|

The precise meaning of this character will be made clear in the discussion of the algorithm.

### 2.6 [Implicit Directional Marks](https://unicode.org/reports/tr9/#Implicit_Directional_Marks)

These characters are very light-weight formatting. They act exactly like right-to-left or left-to-right characters, except that they do not display or have any other semantic effect. Their use is more convenient than using explicit embeddings or overrides because their scope is much more local.

|Abbr.|Code Point|Name|Description|
|---|---|---|---|
|**LRM**|U+200E|LEFT-TO-RIGHT MARK|Left-to-right zero-width character|
|**RLM**|U+200F|RIGHT-TO-LEFT MARK|Right-to-left zero-width non-Arabic character|


---


In [museums](https://en.wikipedia.org/wiki/Museum "Museum"), the [collection](https://en.wikipedia.org/wiki/Collection_\(museum\) "Collection (museum)") of [cultural property](https://en.wikipedia.org/wiki/Cultural_property "Cultural property") or material is normally catalogued in a **collection catalog** (or **collections catalog**). Traditionally this was done using a [card index](https://en.wikipedia.org/wiki/Card_index "Card index"), but nowadays it is normally implemented using a computerized [database](https://en.wikipedia.org/wiki/Database "Database") (known as a **collection database**) and may even be made available online.


---

In the context of libraries and archives, an **inventory** refers to a detailed list or record of the items, materials, or resources held within a collection.

## Overview

It helps to document and organize the contents, making it easier for staff to manage, locate, and track items. An [inventory](https://en.wikipedia.org/wiki/Inventory "Inventory") typically includes information such as titles, authors, publication dates, call numbers, and other relevant details about each item in the collection. It is the one method that [libraries](https://en.wikipedia.org/wiki/Libraries "Libraries") and [archives](https://en.wikipedia.org/wiki/Archives "Archives") use to determine whether some items in their collection are in need of [preservation](https://en.wikipedia.org/wiki/Preservation_\(library_and_archival_science\) "Preservation (library and archival science)") or conservation activities. A modern inventory might involve examining item by item with a [barcode scanner](https://en.wikipedia.org/wiki/Barcode_scanner "Barcode scanner") and a laptop, with the objective of adjusting bibliographic and item records in theirs and [OCLC](https://en.wikipedia.org/wiki/OCLC "OCLC")'s [WorldCat](https://en.wikipedia.org/wiki/WorldCat "WorldCat") databases.[[1]](https://en.wikipedia.org/wiki/Inventory_\(library_and_archive\)#cite_note-1) Using a laptop and handheld bar code reader will "reduce human error and inconsistencies, while helping to maintain staff concentration and enthusiasm for the project".[[2]](https://en.wikipedia.org/wiki/Inventory_\(library_and_archive\)#cite_note-2)

Print materials in the digital age, though dramatically decreased in size compared to e-print materials, are still valuable components of a library's collection. Increasing print material's accessibility, and reducing user frustration, make the inventory process an effective tool in improving library service quality. "When library users are unable to find materials in the expected locations, they lose confidence in the library catalog as well as in the library itself".[[3]](https://en.wikipedia.org/wiki/Inventory_\(library_and_archive\)#cite_note-Greenwood_2013_77%E2%80%9389-3) Missing or mislabeled books have a direct impact on the quality of library services. Maintaining the stacks through inventories and shelf reading can mitigate staff time lost searching for missing or mislabeled items.


---
Now that inventory policy and procedure have been established, it is time to carry out the inventory. Conducting an inventory is the final step to the inventory process; it is relatively simple in that the actions are repetitive, but it can be one of the most time-consuming parts of the inventory process, depending upon the size of the collection and the intended scope of the inventory.

Select a method of approach when beginning the inventory process. How will the collection be inventoried? Shelf by shelf; or in numerical order of the catalogue? Once the inventory method is decided, a uniformed and basic inventory record for each object needs to be created. Such a record might contain the following:

1. Object Number
2. Object Name
3. Brief Description of Object
4. Condition (provides opportunity to conduct a condition check of the object)
5. Current Location
6. Notes (any other details not included in checklist, such as alerting the need for conservation treatment)
7. Recorder and Date[[14]](https://en.wikipedia.org/wiki/Inventory_\(museums\)#cite_note-14)

---


Traditionally, there are the following types of catalog:

- _Author_ catalog: a formal catalog, [sorted](https://en.wikipedia.org/wiki/Collation "Collation") alphabetically according to the names of authors, editors, illustrators, etc.
- Subject catalog: a catalog that sorted based on the Subject.
- _Title_ catalog: a formal catalog, sorted alphabetically according to the article of the entries.
- _Dictionary_ catalog: a catalog in which all entries (author, title, subject, series) are interfiled in a single alphabetical order. This was a widespread form of card catalog in North American libraries prior to the introduction of the computer-based catalog.[[20]](https://en.wikipedia.org/wiki/Library_catalog#cite_note-Wiegand-20)
- _[Keyword](https://en.wikipedia.org/wiki/Index_term "Index term")_ catalog: a subject catalog, sorted alphabetically according to some system of keywords.
- Mixed alphabetic catalog forms: sometimes, one finds a mixed author / title, or an author / title / keyword catalog.
- _Systematic_ catalog: a subject catalog, sorted according to some systematic subdivision of subjects. Also called a _Classified_ catalog.
- _Shelf list_ catalog: a formal catalog with entries sorted in the same order as bibliographic items are shelved. This catalog may also serve as the primary inventory for the library.

---

## System architecture

Local catalogs of many OCLC member libraries are intermittently synchronized with the WorldCat database.[[27]](https://en.wikipedia.org/wiki/WorldCat#cite_note-27) WorldCat allows participating institutions to add direct links from WorldCat to their own local catalog entries for particular items, which enables the user to click through to the local catalog to quickly determine an item's real-time status (for example, whether or not it is checked out).[[28]](https://en.wikipedia.org/wiki/WorldCat#cite_note-whatis-28)

In a small percentage of libraries,[[29]](https://en.wikipedia.org/wiki/WorldCat#cite_note-29) the local catalog is also run by OCLC using an [integrated library system](https://en.wikipedia.org/wiki/Integrated_library_system "Integrated library system") called WorldCat Discovery and WorldShare Management Services.[[30]](https://en.wikipedia.org/wiki/WorldCat#cite_note-30)

Library contributions to WorldCat are made via the Connexion computer program,[[31]](https://en.wikipedia.org/wiki/WorldCat#cite_note-31) which was introduced in 2001; its predecessor, OCLC Passport, was phased out in May 2005.[[32]](https://en.wikipedia.org/wiki/WorldCat#cite_note-32) [Cataloging](https://en.wikipedia.org/wiki/Cataloging "Cataloging") librarians may also use the WorldShare Record Manager[[33]](https://en.wikipedia.org/wiki/WorldCat#cite_note-33) or WorldCat Metadata API[[34]](https://en.wikipedia.org/wiki/WorldCat#cite_note-34) for similar purposes.[[35]](https://en.wikipedia.org/wiki/WorldCat#cite_note-35)


---

## Structure

Croissant builds upon [schema.org](https://en.wikipedia.org/wiki/Schema.org "Schema.org"), uses primarily [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD "JSON-LD"), and divides metadata in four "layers": _Dataset Metadata, Resource, Structure_ and _Semantic_:[[1]](https://en.wikipedia.org/wiki/Croissant_\(metadata_format\)#cite_note-:0-1)[[3]](https://en.wikipedia.org/wiki/Croissant_\(metadata_format\)#cite_note-3)

- The _Dataset Metadata_ layer constrains which schema.org properties should be used, including additional properties, linking together the resources (_files_) of the dataset with general metadata, like [licensing](https://en.wikipedia.org/wiki/Licensing "Licensing") and [citation](https://en.wikipedia.org/wiki/Citation "Citation") information.
- The _Resource_ layer describes the individual files and sets of those using two new classes, _FileObject_ and _FileSet._ A _FileSet_ may be a collection of related images.
- The _Structure_ layer specifies how the files are organized in the dataset. A _RecordSet_ class describes how resources are present, configurations that may very a lot between modality. This specification facilitates [interoperability](https://en.wikipedia.org/wiki/Interoperability "Interoperability") of the datasets.
- Finally, the _Semantic_ layer adds information for [practical reuse](https://en.wikipedia.org/wiki/Machine_learning "Machine learning") of the dataset, such as splits for train, test and validation subsets.
---

The [Semantic Web Stack](https://en.wikipedia.org/wiki/Semantic_Web_Stack "Semantic Web Stack") illustrates the architecture of the Semantic Web. The functions and relationships of the components can be summarized as follows:[[34]](https://en.wikipedia.org/wiki/Semantic_Web#cite_note-34)

- XML provides an elemental syntax for content structure within documents, yet associates no semantics with the meaning of the content contained within. XML is not at present a necessary component of Semantic Web technologies in most cases, as alternative syntaxes exist, such as [Turtle](https://en.wikipedia.org/wiki/Turtle_\(syntax\) "Turtle (syntax)"). Turtle is a de facto standard, but has not been through a formal standardization process.
- [XML Schema](https://en.wikipedia.org/wiki/W3C_XML_Schema "W3C XML Schema") is a language for providing and restricting the structure and content of elements contained within XML documents.
- RDF is a simple language for expressing [data models](https://en.wikipedia.org/wiki/Data_model "Data model"), which refer to objects ("[web resources](https://en.wikipedia.org/wiki/Web_resource "Web resource")") and their relationships. An RDF-based model can be represented in a variety of syntaxes, e.g., [RDF/XML](https://en.wikipedia.org/wiki/RDF/XML "RDF/XML"), N3, Turtle, and RDFa. RDF is a fundamental standard of the Semantic Web.[[35]](https://en.wikipedia.org/wiki/Semantic_Web#cite_note-35)[[36]](https://en.wikipedia.org/wiki/Semantic_Web#cite_note-36)
- RDF Schema extends RDF and is a vocabulary for describing properties and classes of RDF-based resources, with semantics for generalized-hierarchies of such properties and classes.
- OWL adds more vocabulary for describing properties and classes: among others, relations between classes (e.g. disjointness), cardinality (e.g. "exactly one"), equality, richer typing of properties, characteristics of properties (e.g. symmetry), and enumerated classes.
- SPARQL is a protocol and query language for semantic web data sources.
- RIF is the W3C Rule Interchange Format. It is an XML language for expressing Web rules that computers can execute. RIF provides multiple versions, called dialects. It includes a RIF Basic Logic Dialect (RIF-BLD) and RIF Production Rules Dialect (RIF PRD).

### Current state of standardization

Well-established standards:

- [RDF - Resource Description Framework](https://en.wikipedia.org/wiki/Resource_Description_Framework "Resource Description Framework")
- [RDFS - Resource Description Framework Schema](https://en.wikipedia.org/wiki/RDFS "RDFS")
- [RIF - Rule Interchange Format](https://en.wikipedia.org/wiki/Rule_Interchange_Format "Rule Interchange Format")
- [SPARQL - 'SPARQL Protocol and RDF Query Language'](https://en.wikipedia.org/wiki/SPARQL "SPARQL")
- [Unicode](https://en.wikipedia.org/wiki/Unicode "Unicode")
- [URI - Uniform Resource Identifier](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier "Uniform Resource Identifier")
- [OWL - Web Ontology Language](https://en.wikipedia.org/wiki/Web_Ontology_Language "Web Ontology Language")
- [XML - Extensible Markup Language](https://en.wikipedia.org/wiki/XML "XML")

Not yet fully realized:

- Unifying Logic and Proof layers
- [SWRL - Semantic Web Rule Language](https://en.wikipedia.org/wiki/Semantic_Web_Rule_Language "Semantic Web Rule Language")