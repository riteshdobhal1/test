package test

import org.specs2.mutable._
import org.specs2.specification._
import play.api._
import play.api.mvc._
import play.api.test._
import play.api.test.Helpers._
import constants._
/**
 * Tests the Table module
 * 
 */
class TableSpec extends Specification {
  var fake: FakeApplication = _
  
  "Table Spec".title
  step {fake = FakeApplication()}
  step {Play.start(fake)}
  
  textFragment("setting up a Table with fake data")
  val colNames = List("sysid", "location", "cores", "memory", "disk", "class", "obs_ts")
  val colValues = List(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L), Array("sys2", "San Francisco", 16, 128, 3.0, "s", 1415931803000L), 
                       Array("sys3", "Boston", 4, 32, 0.5, "m", 1415935403000L), Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L),
                       Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L), Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))

  val table = new models.Table(colNames, colValues)

  "Table" should {   
    "support filter on a string column" in  {
        val response = table.where("sysid", "=", "sys5")
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }

    "support contains filter on a string column" in  {
        val response = table.where("sysid", "~", "sys5")
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }
    
    "support greater than filter on a string column" in  {
        val response = table.where("sysid", ">", "sys5")
        response(0) must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less than filter on a string column" in  {
        val response = table.where("sysid", "<", "sys2")
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support greater or equal to filter on a string column" in  {
        val response = table.where("sysid", ">=", "sys6")
        response(0) must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less or equal to filter on a string column" in  {
        val response = table.where("sysid", "<=", "sys1")
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support equal filter on an int column" in  {
        val response = table.where("cores", "=", 8)
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support greater than filter on an int column" in  {
        val response = table.where("cores", ">", 16)
        response(0) must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less than filter on an int column" in  {
        val response = table.where("cores", "<", 4)
        response(0) must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
    }
    
    "support greater than equal to filter on an int column" in  {
        val response = table.where("cores", ">=", 48)
        response(0) must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less than equal to filter on an int column" in  {
        val response = table.where("cores", "<=", 2)
        response(0) must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
    }
    
    "support equal filter on an float column" in  {
        val response = table.where("disk", "=", 1.5)
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support greater than filter on an float column" in  {
        val response = table.where("disk", ">", 3.0)
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }
    
    "support less than filter on an float column" in  {
        val response = table.where("disk", "<", 0.5)
        response(0) must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
    }
    
    "support greater than equal to filter on an float column" in  {
        val response = table.where("disk", ">=", 6.0)
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }
    
    "support less than equal to filter on an float column" in  {
        val response = table.where("disk", "<=", 0.25)
        response(0) must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
    }
    
    "support equal filter on an long column" in  {
        val response = table.where("obs_ts", "=", 1415928203000L)
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support greater than filter on an long column" in  {
        val response = table.where("obs_ts", ">", 1415935403000L)
        val (r1::r2::Nil) = response
        r1 must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
        r2 must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less than filter on an long column" in  {
        val response = table.where("obs_ts", "<", 1415931803000L)
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support greater than equal to filter on an long column" in  {
        val response = table.where("obs_ts", ">=", 1415942603000L)
        val (r1::r2::Nil) = response
        r1 must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
        r2 must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support less than equal to filter on an long column" in  {
        val response = table.where("obs_ts", "<=", 1415928203000L)
        response(0) must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
    }
    
    "support multiple filters" in  {
        val response = table.where(table, List(("location", "=", "\"Bangalore\""), ("sysid", "=", "\"sys5\"")), colNames)
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }
    
    "support multiple filters" in  {
        val response = table.where(table, List(("location", "=", "\"Bangalore\""), ("cores", "=", "48")), colNames)
        response(0) must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support multiple filters" in  {
        val response = table.where(table, List(("test", "=", "\"Bangalore\""), ("cores", "=", "48")), colNames)
        response must equalTo(List())
    }
    
    "support multiple filters" in  {
        val response = table.where(table, List(("sysid", "=", "\"sys5\"")), colNames)
        response(0) must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }
    
    "support multiple filters" in  {
        val response = table.where(table, List(("test", "=", "48")), colNames)
        response must equalTo(List())
    }
    
    "support sortBy function for int" in  {
        val response = table.sortBy("cores", true)
        val (r1::r2::r3::r4::r5::r6::Nil) = response
        r1 must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
        r2 must equalTo(Array("sys3", "Boston", 4, 32, 0.5, "m", 1415935403000L))
        r3 must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
        r4 must equalTo(Array("sys2", "San Francisco", 16, 128, 3.0, "s", 1415931803000L))
        r5 must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
        r6 must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support sortBy function for string" in  {
        val response = table.sortBy("sysid", false)
        val (r1::r2::r3::r4::r5::r6::Nil) = response
        r6 must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
        r5 must equalTo(Array("sys2", "San Francisco", 16, 128, 3.0, "s", 1415931803000L))
        r4 must equalTo(Array("sys3", "Boston", 4, 32, 0.5, "m", 1415935403000L))
        r3 must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
        r2 must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
        r1 must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support sortBy function for long" in  {
        val response = table.sortBy("obs_ts", true)
        val (r1::r2::r3::r4::r5::r6::Nil) = response
        r1 must equalTo(Array("sys1", "San Jose", 8, 64, 1.5, "s", 1415928203000L))
        r2 must equalTo(Array("sys2", "San Francisco", 16, 128, 3.0, "s", 1415931803000L))
        r3 must equalTo(Array("sys3", "Boston", 4, 32, 0.5, "m", 1415935403000L))
        r4 must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
        r5 must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
        r6 must equalTo(Array("sys6", "Bangalore", 48, 384, 3.0, "e", 1415942603000L))
    }
    
    "support min function" in  {
        val response = table.min("cores")
        response must equalTo(Array("sys4", "Boston", 2, 16, 0.25, "m", 1415935403000L))
    }

    "support max function" in  {
        val response = table.max("disk")
        response must equalTo(Array("sys5", "Bangalore", 16, 128, 6.0, "e", 1415942603000L))
    }

    "support sum function" in  {
        val response = table.sum("cores")
        response must equalTo(94.0)
    }
    
    "support average function" in  {
        val response = table.avg("memory")
        math.round(response) must equalTo(125)
    }
    
    "support count function" in  {
        val response = table.count("location")
        response must equalTo(6)
    }
    
    val equality: (Array[Any], Array[Any]) => Boolean = (a1: Array[Any], a2: Array[Any]) => a1(0) == a2(0)
    
    "support sum group by function" in  {
        val response = table.sumGroupBy("disk", "class")
        response must containTheSameElementsAs(List(("s", 4.5), ("m", 0.75), ("e", 9.0))) 
    }
    
    "support average group by function" in  {
        val response = table.avgGroupBy("cores", "location")
        response must containTheSameElementsAs (List(("San Jose", 8.0), ("San Francisco", 16.0), ("Boston", 3.0), ("Bangalore", 32.0)))
    }
        
    "support count group by function" in  {
        val response = table.countGroupBy("class", "location")
        response must containTheSameElementsAs (List(("San Jose", 1), ("San Francisco", 1), ("Boston", 2), ("Bangalore", 2)))
    }
    
       
  }

  step {Play.stop}
}
