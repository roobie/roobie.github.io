module Personae exposing (Persona, personaGenerator, emptyPersona)

import Data.Species -- exposing (..)
import Data.Names exposing (..)

import Random exposing (Generator, map)
import Random.Extra exposing (andMap, sample)


-- HELPERS

defaultString = Maybe.withDefault ""

type alias Persona =
    { age: Int
    , firstName: String
    , surName: String
    , species: String
    , subspecies: String
    }

genAge : Generator Int
genAge = (Random.int 18 80)

genFirstName : Generator String
genFirstName = sample firstNames |> map defaultString

genSpecies = sample Data.Species.common |> map defaultString

personaGenerator : Generator Persona
personaGenerator =
    map Persona genAge
        |> andMap genFirstName
        |> andMap genFirstName
        |> andMap genSpecies
        |> andMap genFirstName

emptyPersona : Persona
emptyPersona =
    { age = 0
    , firstName = ""
    , surName = ""
    , species = ""
    , subspecies = ""
    }
