module Personae exposing
    ( Persona(..)
    , PersonaLevel(..)
    , Msg
    , personaGenerator
    , emptyPersona
    , view
    )

import Html exposing (Html, button, div, text)

import Data.Generators exposing (..)

import Random exposing (Generator, map)
import Random.Extra exposing (andMap, sample)

tempGenStr = Random.constant ""

{-| The Demeanor should indicate on a high level
how a person acts in a general sense. This should
briefly describe the visually observable way the person
acts/does not act. Of course, sometimes, some values
for Demeanor might not be discernible just by glancing
at the person, but might need a closer look.

E.g. casual, nervous, angry, mad/insane, calm, sneaky
-}
type Demeanor = Demeanor String
genDemeanor = tempGenStr |> map Demeanor

{-| The Disposition should describe the person's temperament
in a closer aspect than what Demeanor would. Also the general
frame of mind and way of looking at the world.

E.g.
- Thinks violence solves problems best. Trying to verbally discuss
something with this person has a high chance in ending up in a fight.
- Hates banks with a passion, because they are lawful thieves.
Would consider robbing one
- Loves having right. So much so, that the person almost never admits.
or even realises, that s/he is wrong.
-}
type Disposition = Disposition String
genDisposition = tempGenStr |> map Disposition

{-| A description of the person's voice

E.g. raspy, low, high, hoarse, coarse, powerful, tiny
-}
type Voice = Voice String
genVoice = tempGenStr |> map Voice

{-| Description of the visible apparel the person is sporting
-}
type Apparel = Apparel String
genApparel = tempGenStr |> map Apparel

{-| Description of the not so visible apparel the person is sporting
-}
type ObscuredApparel = ObscuredApparel String
genObscuredApparel = tempGenStr |> map ObscuredApparel

{-| BasicProperties should describe things about a person
that is easily observable by others.

Even though it would contain exact data, when describing
them for the players, one would give approximate values.
E.g. 87.3 kg ->
sometimes "about 70 or 80 kg"
sometimes "somewhere around 80-90 kg"
|-}
type alias BasicProperties =
    { height: Float
    , weight: Float
    , age: Float
    }

{-| ExtendedProperties should contain data that a more observant
observer would be able to determine.
-}
type alias ExtendedProperties =
    { eyeColor: String
    , scars: String
    }

type PersonaLevel
    = Level1

{-| Level 1 Persona should be able to describe a little about
how a person moves and generally acts, when observed from afar
-}
type alias L1Persona =
    { demeanor: Demeanor
    , apparel: Apparel
    }

type alias L2Persona =
    { demeanor: Demeanor
    , disposition: Disposition
    , apparel: Apparel
    , voice: Voice
    }

type Persona
    = EmptyPersona
    | L1 L1Persona


personaGenerator : PersonaLevel -> Generator Persona
personaGenerator ptype =
    case ptype of
        Level1 ->
            map L1Persona genDemeanor
                |> andMap genApparel
                |> map L1

emptyPersona : Persona
emptyPersona = EmptyPersona

type Msg
    = Nil

view : Persona -> Html Msg
view model =
    case model of
        EmptyPersona -> div [] []
        L1 persona -> div [] []
