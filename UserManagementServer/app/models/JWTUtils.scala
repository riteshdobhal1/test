package models

import authentikat.jwt._
import com.twilio.jwt.accesstoken.AccessToken
import dao.vertica
import play.api.Logger
import play.api.libs.json.Json
import play.api.mvc._

case class UserAccessToken(email: String)
case class UserAccessTokenPayload(email: String, access_token: Option[String])

object JWTUtils {

  val log = Logger("Model_JWTUtils")

  private val JwtSecretKey = "2efd91d6fbed8665ac01c5bc3d719df68e2258aae6e15e0c291a4795bba25345e867b77dc6aee8cc5146ff98a8820e742d911b0e45bc2ed3dddb5a638f82a8c6"
  private val JwtSecretAlgo = "HS256"

  def createToken(payload: UserAccessToken): String = {
    log.debug(s"createToken called...")
    log.debug(s"payload: $payload")
    implicit val accessTokenWrite = Json.writes[UserAccessToken]
    val data = Json.toJson(payload)
    val dataStr = Json.stringify(data)
    val header = JwtHeader(JwtSecretAlgo)
    val claimsSet = JwtClaimsSet(dataStr)
    JsonWebToken(header, claimsSet, JwtSecretKey)
  }

  def isValidToken(jwtToken: String): Boolean = JsonWebToken.validate(jwtToken, JwtSecretKey)

  def decodePayload(jwtToken: String): Option[String] = {
    log.debug(s"decodePayload called...")
    log.debug(s"jwtToken: $jwtToken")
    jwtToken match {
      case JsonWebToken(header, claimsSet, signature) => Option(claimsSet.asJsonString)
      case _ => None
    }
  }

  def validateAccessToken(jwtToken: String, uid: String) = {
    log.debug(s"checking jwtToken value : $jwtToken for user : $uid")
    if (models.JWTUtils.isValidToken(jwtToken)) {
      models.JWTUtils.decodePayload(jwtToken) match {
        case Some(payload) => {
          val userInfoJson = Json.parse(payload)
          val userEmail = (userInfoJson \ "email").as[String]
          val userInfo = UserAccessToken(userEmail)
          val accessTokenRows = vertica.user.selectAccessTokenDetails(userInfo.email)
          if(accessTokenRows.size == 0){
            log.error(s"No user found in DB for emailId : ${userInfo.email}")
            Results.Forbidden("Only Authorized users allowed!!")
          }
          val dbUsername = models.Utils.getDBStringVal(accessTokenRows.head, vertica.user.Col_email, "")
          val isUserActive = models.Utils.getDBIntVal(accessTokenRows.head, vertica.user.Col_active)
          if (!dbUsername.equals("") && userInfo.email.equals(dbUsername) && isUserActive == 1) {
            Results.Ok("SUCCESS")
          } else {
            log.error(s"jwtToken username is invalid or user in inactive: $jwtToken")
            Results.Forbidden("Only Authorized users allowed!!")
          }
        }
        case _ => {
          log.error(s"jwtToken format is invalid : $jwtToken")
          Results.Forbidden("Only Authorized users allowed!!")
        }
      }
    } else {
      log.error(s"jwtToken is invalid : $jwtToken")
      Results.Forbidden("Only Authorized users allowed!!")
    }
  }

  def getTokenUsername(jwtToken: String): Option[String] = {
    log.debug(s"getTokenUsername called : token : $jwtToken")
    if (models.JWTUtils.isValidToken(jwtToken)) {
      models.JWTUtils.decodePayload(jwtToken) match {
        case Some(payload) => {
          val userInfoJson = Json.parse(payload)
          val userEmail = (userInfoJson \ "email").as[String]
          Some(userEmail)
        }
        case _ => {
          log.error(s"token format is invalid : $jwtToken")
          None
        }
      }
    } else {
      log.error(s"token is invalid : $jwtToken")
      None
    }
  }
}
