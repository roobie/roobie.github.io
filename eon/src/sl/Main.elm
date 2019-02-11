import Browser
import Random
import Personae as P
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)


-- MAIN

main =
  Browser.element
      { init = init
      , update = update
      , subscriptions = subscriptions
      , view = view
      }


-- MODEL

type alias Model =
    { persona: P.Persona
    }


-- INIT

newMinimalPersona = Random.generate
                    ShowNewPersona
                    (P.personaGenerator P.Level1)

init : () -> (Model, Cmd Msg)
init _ =
    ( { persona = P.emptyPersona }
    , newMinimalPersona
    )


-- UPDATE

type Msg
    = GenerateNewPersona
    | ShowNewPersona P.Persona
    | PersonaMsg P.Msg

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        GenerateNewPersona ->
            ( model
            , newMinimalPersona
            )

        ShowNewPersona persona ->
            ( {model | persona = persona }
            , Cmd.none
            )

        PersonaMsg pmsg ->
            ( model
            , Cmd.none
            )


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW

view : Model -> Html Msg
view model =
  let
      personaView = P.view model.persona
  in
  div [ class "row"]
      [ div [class "col"]
            [Html.map PersonaMsg personaView]
      ]
