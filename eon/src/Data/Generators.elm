module Data.Generators exposing (..)

import Random exposing (Generator, map)
import Random.Extra exposing (andMap, sample)

import Data.Species -- exposing (..)
import Data.Names exposing (..)

defaultString = Maybe.withDefault ""

genAge : Generator Int
genAge = (Random.int 18 80)

genFirstName : Generator String
genFirstName = sample firstNames |> map defaultString

genSpecies = sample Data.Species.common |> map defaultString
