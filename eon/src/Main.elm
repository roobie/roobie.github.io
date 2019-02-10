import Browser
import Random
import Personae exposing (Persona, personaGenerator, emptyPersona)
import Html exposing (Html, button, div, text)
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
    { persona: Persona
    }


-- INIT

newMinimalPersona = Random.generate
                    ShowNewPersona
                    (personaGenerator Personae.Level1)

init : () -> (Model, Cmd Msg)
init _ =
    ( { persona = emptyPersona }
    , newMinimalPersona
    )


-- UPDATE

type Msg
    = GenerateNewPersona
    | ShowNewPersona Persona

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


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none


-- VIEW

view : Model -> Html Msg
view model =
  div [ class "row"]
      [ div [class "col"]
            []
      ]
