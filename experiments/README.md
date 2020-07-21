# Preparing a corpus for use with evidence

The aim of the `evidence` tool is to enable and support researchers interested in
applying a close-reading methodology for their scientific question to efficiently
make use of large digitized text corpora. Of course, different researchers will
be interested in different corpora based on their scientific focus. Rather than
provide support for (a selection of) specific corpora, `evidence` is therefore designed
to ingest and make accessible via its user interface (UI) a corpus of the user's choice.

The ability to do so, however, depends on the user presenting `evidence` the corpus in
question in a manner the tool understands. Accordingly, this document outlines what is
understood as a corpus in the context of `evidence`, and in what format the user should
supply their corpus in order to make use of `evidence`. Given the plethora of formats in
which corpora may exist in digital archives we do not provide general instructions on
how to prepare any specific corpus to meet the required format, instead focusing only on
the structure `evidence` expects.

## A corpus

In the context of `evidence`, we refer to a corpus as a collection of individual documents
or texts.

### Documents
There are no strict upper or lower limits to the number of documents a collection
can/should contain, however, as `evidence` trains a machine learning model on the corpus,
too small corpora may give rise to poor performance. Typically, a corpus containing several
million words, respectively several ten thousand paragraphs (see below) should suffice.

### Paragraphs
The expectation is that each document will consist of a (varying) number of paragraphs.
There is no upper bound on the number of paragraphs an individual document may have, nor is there
a strict lower bound. However, as a rule of thumb, at least 2 paragraphs (with of order 150 words) is
a good lower bound.

### Languages
Preferably, all documents within a corpus should be written in one language. However, this is
not a strict requirement. If multiple languages are present, the fractions of the total corpus in
each language should ideally be balanced. If this is not the case, `evidence` will still work,
however results for the minority language(s) may be untrustworthy, especially if the corpus itself
is small ( < 10.000 fragments).

## Structure within `evidence`

While the constituent documents provide a natural subdivision of a corpus, they are not sufficiently
granular for accurately identifying sections of text with a common topic or theme. Therefore, rather
than processing the documents of a corpus as a whole, `evidence` makes use of sub-sections of
documents of a corpus.

### Fragments
Referred to as fragments, these sub-sections represent the atomic unit of a corpus within `evidence` and
the set of all fragments makes up the corpus. Each fragment has a unique id, which simultaneously also links it to its parent document. Together the fragments form a flat hierarchical layer on which search queries are executed.

We strongly suggest a fragment length of ca. 150 words, while not splitting inside of a paragraph. This choice
is meant to restrain a fragment to one main topic, while providing enough length/context to account for more
complex topics. It is, however, up to the user to decide the fragment length for their corpus.


## Corpus preparation

In order to ingest a corpus into the evidence tool, the user must provide it as a nested file/folder structure.

Within a top-level folder named `corpus` the user places a folder per corpus document, with a unique name
identifying the document.

Within each of these folders all fragments constituting a document are placed. Each
fragment should have a name identifying its place in the sequence of fragments constituting the parent document
and adhering to the format `AAA_paragraph_XX-YY_BBB.txt`, where
`AAA` can be any string (not containing `paragraph_`), `XX` and `YY` should be two numbers
with `YY` > `XX` denoting the paragraphs contained in the fragment, and `BBB` can again be any string
(not containing `paragraph_`). Valid examples are:

`paragraph_9-12.txt`

`mycol_paragraph_99-112_clean.txt`

This filename must be unique WITHIN a document, but need not be unique within the corpus.

Each of these fragment files should be formatted as a single line of flat ascii text
containing the full content of the contained paragraphs.

## Corpus ingestion
The aforementioned `corpus` folder with its substructures and contents can then be copied to the folder the
user has created in the `experiment` folder and ingested into the evidence tool as detailed in the instructions
(see [README](../README.md)).
