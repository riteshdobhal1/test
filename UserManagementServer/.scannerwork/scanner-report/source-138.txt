package models

import scala.language.postfixOps
import play.api.Logger

import org.joda.time._
import org.joda.time.format._
import constants._

class Table(val colNames: List[String], val colValues: List[Array[Any]]) {
  type Results = List[Array[Any]]

  val  index = colNames.zipWithIndex toMap
  val log = Logger("Model_Table")
  def withType(x: Any) = x match {
          case i: Int => i
          case l: Long => l
          case f: Float => f
          case d: Double => d
  }
  
  def filter[T](colName: String)( c: T => Boolean): Results = {
    val i = index(colName)
    colValues.filter {x:Array[Any] => c(x(i).asInstanceOf[T])}
  }

  def where(colName: String, op: String, rhs: Double): Results = {
    val i = index(colName)
    op match {
      case "!=" => colValues.filter { _(i) != rhs }
      case "=" => colValues.filter { _(i) == rhs }
      case ">" => colValues.filter {
        _(i) match {
          case iv: Int => iv > rhs
          case l: Long => l > rhs
          case f: Float => f > rhs
          case d: Double => d > rhs
          case s: String => false
          case _ => false
        }
      }

      case "<" => colValues.filter {
        _(i) match {
          case iv: Int => iv < rhs
          case l: Long => l < rhs
          case f: Float => f < rhs
          case d: Double => d < rhs
          case s: String => false
        }
      }

      case "<=" => colValues.filter {
        _(i) match {
          case iv: Int => iv <= rhs
          case l: Long => l <= rhs
          case f: Float => f <= rhs
          case d: Double => d <= rhs
          case s: String => false
        }
      }

      case ">=" => colValues.filter {
        _(i) match {
          case iv: Int => iv >= rhs
          case l: Long => l >= rhs
          case f: Float => f >= rhs
          case d: Double => d >= rhs
          case s: String => false
        }
      }
    }

  }

  def where(table: models.Table, flist: List[(String, String, String)], cols: List[String]): Results = {
    if (flist.length == 1) {
      if (cols.contains(flist.head._1)) {
        val rhs = flist.head._3
        val (isRhsStr, sRhs, nRhs) = if (rhs.charAt(0) == '\"') (true, rhs.substring(1, rhs.length - 1), 0.0) else (false, "", rhs.toDouble)
        if (isRhsStr)
          return table.where(flist.head._1, flist.head._2, sRhs)
          else {
            return table.where(flist.head._1, flist.head._2, nRhs)
          }
      }
      List[Array[Any]]()
    } else {
      val f = flist.head
      if (cols.contains(flist.head._1)) {
        val rhs = flist.head._3
        val (isRhsStr, sRhs, nRhs) = if (rhs.charAt(0) == '\"') (true, rhs.substring(1, rhs.length - 1), 0.0) else (false, "", rhs.toDouble)
        val tbl = if (isRhsStr)
          new models.Table(cols, table.where(f._1, f._2, sRhs))
        else
          new models.Table(cols, table.where(f._1, f._2, nRhs))
        where(tbl, flist.tail, cols)
      } else
        List[Array[Any]]()
    }
  }

  def where(colName: String, op: String, rhs: String): Results = {
    val i = index(colName)
    op match {
      case "!=" => colValues.filter { _(i) != rhs }
      case "=" => colValues.filter { _(i) == rhs }

      case "~" => colValues.filter {
        _(i) match {
          case s: String => {
            s.toLowerCase().contains(rhs.toLowerCase()) 
          }
          case _ => false
        }
      }
        
      case ">" => colValues.filter {
        _(i) match {
          case s: String => s > rhs
          case _ => false
        }
      }

      case "<" => colValues.filter {
        _(i) match {
          case s: String => s < rhs
          case _ => false
        }
      }

      case "<=" => colValues.filter {
        _(i) match {
          case s: String => s <= rhs
          case _ => false
        }
      }

      case ">=" => colValues.filter {
        _(i) match {
          case s: String => s >= rhs
          case _ => false
        }
      }
    }
  }

  def sortBy(colName: String, asc: Boolean): Results = {
    val i = index(colName)
    colValues.sortWith((x,y) => {
       val result = x(i) match {
            case fs: String => fs < y(i).asInstanceOf[String]
            case fi: Int => fi < y(i).asInstanceOf[Int]
            case fl: Long => fl < y(i).asInstanceOf[Long]
            case ff: Float => ff < y(i).asInstanceOf[Float]
            case fd: Double => fd  < y(i).asInstanceOf[Double]
       }
 
        if (asc) result else !result
       })
  }

  def min[T <% Ordered[T]](colName: String): Array[Any] = {
    val i = index(colName)
    colValues.minBy { _(i).asInstanceOf[T] }
  }
  
  def max[T <% Ordered[T]](colName: String): Array[Any] = {
    val i = index(colName)
    colValues maxBy { _(i).asInstanceOf[T]  }
  }

  def sum(colName: String): Double = {
    val i = index(colName)
    (0.0 /: colValues)((z, x) => z + withType(x(i)))
  }

  def avg(colName: String): Double = {
    val i = index(colName)
    val (sum, count) = colValues.foldLeft( (0.0, 0) ) {(z, x) => (z._1 + (withType(x(i))), z._2 + 1 ) }
    sum / count
  }

  def count(colName: String): Int = {
    val i = index(colName)
    (0 /: colValues)((z, x) => if (x(i) == null) z else z+1)
  }

  def minGroupByMultipleAggr(colName: String, groupByCol: String, cols: List[String]): List[(Any, Any)] = {
    val i = index(colName)
    val g = index(groupByCol)
    colValues groupBy(_(g)) map { case (k,vs) => 
      val tt = vs.minBy{ x => withType(x(i)) }
      (k, tt(i))
    } toList
  }

  def maxGroupByMultipleAggr(colName: String, groupByCol: String, cols: List[String]): List[(Any, Any)] = {
    val i = index(colName)
    val g = index(groupByCol)
    colValues groupBy(_(g)) map { case (k,vs) => 
      val tt = vs.maxBy{ x => withType(x(i)) }
      (k, tt(i))
    } toList
  }

  def sumGroupBy(colName: String, groupByCol: String): List[(Any, Double)] = {
    val i = index(colName)
    val g = index(groupByCol)
    colValues groupBy(_(g)) map { case (k,vs) => (k, (0.0 /: vs) ((z, x) => z + withType(x(i)))) } toList
  }

  def avgGroupBy(colName: String, groupByCol: String): List[(Any, Double)] = {
    val i = index(colName)
    val g = index(groupByCol)
    colValues groupBy(_(g)) map { case (k,vs) => (k, {
       val (sum, count) = vs.foldLeft( (0.0, 0) ) {(z, x) => (z._1 + (withType(x(i))), z._2 + 1 ) }
       sum / count }
       )}  toList
  }

  def countGroupBy(colName: String, groupByCol: String): List[(Any, Int)] = {
    val i = index(colName)
    val g = index(groupByCol)
    colValues groupBy(_(g)) map { case (k,vs) => (k, vs.length) } toList
  }
  
}


