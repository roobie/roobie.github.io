module Personae exposing
    ( Persona(..)
    , PersonaLevel(..)
    , Msg
    , personaGenerator
    , emptyPersona
    , view
    )

import Html exposing (..)
import Html.Attributes as HtmlAttr

import Round

import Data.Generators exposing (..)

import Random
import Random.Extra as RExtra


tempGenStr =
    Random.constant ""


defaultString =
    Maybe.withDefault ""


sampleWithDefault defaultValue pool =
    Random.map (Maybe.withDefault defaultValue)
        (RExtra.sample pool)
sampleWithDefaultString =
    sampleWithDefault ""


{-| The Demeanor should indicate on a high level
how a person acts in a general sense. This should
briefly describe the visually observable way the person
acts/does not act. Of course, sometimes, some values
for Demeanor might not be discernible just by glancing
at the person, but might need a closer look.

E.g. casual, nervous, angry, mad/insane, calm, sneaky
-}
type Demeanor =
    Demeanor String


genDemeanor =
    sampleWithDefaultString ["casual", "nervous", "angry", "insane", "calm", "sneaky", "tired"]
        |> Random.map Demeanor


decodeDemeanor (Demeanor a) =
    a

{-| The Disposition should describe the person's temperament
in a closer aspect than what Demeanor would. Also the general
frame of mind and way of looking at the world.

E.g.
- Thinks violence solves problems best. Trying to verbally discuss
something with this person has a high chance in ending up in a fight.
- Hates banks with a passion, because they are lawful thieves.
Would consider robbing one
- Loves being right. So much so, that the person almost never admits.
or even realises, that s/he is wrong.
- Psychopathic
- Manipulative
- Trusting
- Lazy / Carefree
-}
type Disposition =
    Disposition String


genDisposition =
    sampleWithDefaultString [ "Thinks violence solves all problems"
               , "Hates banks with a passion"
               , "Loves being right (hates being wrong)"
               ]
        |> Random.map Disposition


{-| A description of the person's voice

E.g. raspy, low, high, hoarse, coarse, powerful, tiny
-}
type Voice =
    Voice String


genVoice : Random.Generator Voice
genVoice =
    Random.map Voice <|
        sampleWithDefaultString
        [ "raspy"
        , "low"
        , "high"
        , "hoarse"
        , "coarse"
        , "powerful"
        , "tiny"
        , "thundering"
        ]


decodeVoice : Voice -> String
decodeVoice (Voice a) =
    a


{-| Description of the visible apparel the person is sporting
-}
type Apparel =
    Apparel String


genApparel =
    Random.map Apparel <|
        sampleWithDefaultString [ "dark"
                                , "bright"
                                , "colorful"
                                ]


decodeApparel (Apparel a) =
    a


{-| Description of the not so visible apparel the person is sporting
-}
type ObscuredApparel =
    ObscuredApparel String


genObscuredApparel =
    sampleWithDefaultString ["hidden dagger in the boot"]
        |> Random.map ObscuredApparel


decodeObscuredApparel (ObscuredApparel a) =
    a


{-| BasicProperties should describe things about a person
that is easily observable by others.
|-}
type alias BasicProperties =
    { stature: Stature
    , build: Build
    , age: Age
    }


type Stature = Stature (String, String)


genStature =
    let
        -- could probably be done in a better way.
        lstA = ["short", "normal height", "tall"]
        lstB = ["bent", "crooked", "dominant", "normal posture"]
        lsts = List.map (\a -> List.map (Tuple.pair a) lstB) lstA
        lst = List.concat lsts
    in
    sampleWithDefault ("", "") lst
        |> Random.map Stature


decodeStature (Stature (a, b)) = a ++ ", " ++ b


type Build = Build String


genBuild =
    sampleWithDefaultString ["heavy", "light", "muscular", "slim", "athletic", "shapely"]
        |> Random.map Build


decodeBuild (Build a) = a


type Age = Age String


genAge =
    sampleWithDefaultString ["young", "old", "adult", "adolescent", "teen"]
        |> Random.map Age


decodeAge (Age a) = a


genBasicProperties =
    Random.map BasicProperties genStature
        |> RExtra.andMap genBuild
        |> RExtra.andMap genAge


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
    , voice: Voice
    , basicProperties: BasicProperties
    }


type alias L2Persona =
    { demeanor: Demeanor
    , apparel: Apparel
    , voice: Voice
    , basicProperties: BasicProperties
    , disposition: Disposition
    , extendedProperties: ExtendedProperties
    , obscuredApparel: ObscuredApparel
    }


type Persona
    = EmptyPersona
    | L1 L1Persona


personaGenerator : PersonaLevel -> Random.Generator Persona
personaGenerator ptype =
    case ptype of
        Level1 ->
            Random.map L1Persona genDemeanor
                |> RExtra.andMap genApparel
                |> RExtra.andMap genVoice
                |> RExtra.andMap genBasicProperties
                |> Random.map L1


emptyPersona : Persona
emptyPersona =
    EmptyPersona


type Msg
    = Nil


view : Persona -> Html Msg
view model =
    case model of
        EmptyPersona -> div [] [text "Empty persona"]
        L1 persona -> viewL1Persona persona


viewL1Persona persona =
    div []
        [ div [] [text "L1 Persona"]
        , table []
            [ colgroup []
                  [ col [HtmlAttr.style "width" "25%"] []
                  , col [HtmlAttr.style "width" "75%"] []
                  ]
            , thead []
                [ tr []
                      [ th [] [text "Keyword"]
                      , th [] [text "Value"]
                      ]
                ]
            , tbody []
                [ tr []
                      [ td [] [text ("Demeanor")]
                      , td [] [text (decodeDemeanor persona.demeanor)]
                      ]
                , tr []
                      [ td [] [text ("Stature")]
                      , td [] [text (decodeStature persona.basicProperties.stature)]
                      ]
                , tr []
                      [ td [] [text ("Build")]
                      , td [] [text (decodeBuild persona.basicProperties.build)]
                      ]
                , tr []
                      [ td [] [text ("Apparel")]
                      , td [] [text (decodeApparel persona.apparel)]
                      ]
                , tr []
                      [ td [] [text ("Voice")]
                      , td [] [text (decodeVoice persona.voice)]
                      ]
                , tr []
                      [ td [] [text ("Age")]
                      , td [] [text (decodeAge persona.basicProperties.age)]
                      ]
                ]
            ]
        ]
