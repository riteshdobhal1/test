package models
import play.api.Logger
import scala.util.parsing.combinator._

object FilterParsers extends JavaTokenParsers {
  val log = Logger("Model_FilterParsers")
  def expr: Parser[(String, String, String)] = ident ~ op ~ (stringLiteral | floatingPointNumber) ^^ { case col~op~rhs => (col, op, rhs)}
  def op: Parser[String] = "!=" | ">=" | "<=" | "=" | ">" | "<" | "~"
  def apply(input: String): (String, String, String) = parseAll(expr, input) match {
    case Success(result, _) => result
    case failure : NoSuccess => scala.sys.error(failure.msg)
  }
}

object SortbyParsers extends JavaTokenParsers {
  def expr: Parser[(String, Boolean)] = ident ~ opt("ASC" | "asc" | "DESC" | "desc") ^^ { case col~adOpt => (col, adOpt map{_.toUpperCase == "ASC"} getOrElse(true))}
  def apply(input: String): (String, Boolean)  = parseAll(expr, input) match {
    case Success(result, _) => result
    case failure : NoSuccess => scala.sys.error(failure.msg)
  }
}

object AggrParsers extends JavaTokenParsers {
  def expr: Parser[(String, String, Option[String])] = aggrFun ~ aggrCol ~ opt(groupbyCol)  ^^ { case aggrFun~aggrCol~groupbyCol => (aggrFun, aggrCol, groupbyCol)}
  def aggrCol: Parser[String] = "(" ~> ident <~ ")"
  def aggrFun: Parser[String] = ("sum" | "avg" | "min" | "max" | "count")
  def groupbyCol: Parser[String] = "groupby" ~ "(" ~ ident ~ ")" ^^{ case "groupby"~"("~gCol~")" => gCol}
  def apply(input: String): (String, String, Option[String])  = parseAll(expr, input) match {
    case Success(result, _) => result
    case failure : NoSuccess => scala.sys.error(failure.msg)
  }
}


  
