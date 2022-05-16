package models.query

import org.apache.spark.sql._
import org.apache.spark.sql.types._
import play.api.libs.json._
import java.util.Date
import play.api.Logger
import org.joda.time._

class ResultSet(sRdd: DataFrame) {

  val log = Logger("Model_Analytics")
    override def toString: String = {
      val rows = sRdd.collect()
      rows.mkString("[", ",", "]")
    }
    
   
    def toJson: JsValue = {
      val fields = sRdd.schema.fields
      val typesWithIndex = fields.map{_.dataType}.zipWithIndex
      val rows = sRdd.collect()
      def getRowMap(ti: (org.apache.spark.sql.types.DataType, Int), r: org.apache.spark.sql.Row) = {
        val i = ti._2
        val td = ti._1
        val colName = fields(i).name
        if(r.isNullAt(i))
          Map()
          else 
            td match {
              case StringType => Map(colName -> JsString(r.getString(i)))
              case BooleanType => Map(colName -> JsBoolean(r.getBoolean(i)))
              case IntegerType => Map(colName -> JsNumber(r.getInt(i)))
              case LongType => Map(colName-> JsNumber(r.getLong(i)))
              case FloatType => Map(colName -> JsNumber(r.getFloat(i)))
              case DoubleType => Map(colName -> JsNumber(r.getDouble(i)))
              case ByteType => Map(colName -> JsNumber(r.getByte(i)))
              case TimestampType => Map(colName -> JsString(new DateTime(r(i).asInstanceOf[Date], DateTimeZone.UTC).toString))
              case MapType(_,_,_) => Map(colName -> Json.toJson(r.getMap(i).asInstanceOf[Map[String, String]]))
              case ArrayType(_,_) => Map(colName -> Json.toJson(r.getSeq(i).asInstanceOf[Seq[String]]))
              case DateType => Map(colName -> JsString(new DateTime(r(i).asInstanceOf[Date], DateTimeZone.UTC).toString))
          }
      }
      
      JsArray(rows.map{r => Json.toJson(typesWithIndex.foldLeft(Map[String, JsValue]())((m, ti) => m ++ getRowMap(ti, r)))})
    } 
    
}
