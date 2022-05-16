package models
import scala.annotation.tailrec

case class TreeNode[N](data: N, children: Seq[TreeNode[N]])

class TreeConstructor {

  private case class NodeWithDepth[N](data: N, depth: Int)

  @tailrec
  private def sortNodesByDepth[N](depth: Int,
                                  nodesInDepth: Seq[N],
                                  id: N => String,
                                  nodesByParent: Map[Option[String], Seq[N]],
                                  acc: Seq[NodeWithDepth[N]],
                                  visited: Set[String]): Seq[NodeWithDepth[N]] = {
    val withDepth  = nodesInDepth.map(n => NodeWithDepth(n, depth))
    val calculated = withDepth ++ acc // accumulating in reverse order
    val children = nodesInDepth
      .flatMap(n => nodesByParent.getOrElse(Some(id(n)), Seq.empty))
      .filterNot(c => visited.contains(id(c)))
    if (children.isEmpty)
      calculated
    else
      sortNodesByDepth(depth + 1, children, id, nodesByParent, calculated, visited ++ calculated.map(n => id(n.data)))
  }

  private def calculateNodesDepth[N](nodesInDepth: Seq[N],
                                     id: N => String,
                                     nodesByParent: Map[Option[String], Seq[N]]): Seq[NodeWithDepth[N]] =
    sortNodesByDepth(0, nodesInDepth, id, nodesByParent, Seq.empty, Set.empty)

  @tailrec
  private def buildFromBottom[N](depth: Int,
                                 remaining: Seq[NodeWithDepth[N]],
                                 id: N => String,
                                 nodesByParent: Map[Option[String], Seq[N]],
                                 processesNodesById: Map[String, TreeNode[N]]): Seq[TreeNode[N]] = {
    val (nodesOnCurrentDepth, rest) = remaining.span(_.depth == depth)
    val newProcessedNodes = nodesOnCurrentDepth.map { n =>
      val nodeId   = id(n.data)
      val children = nodesByParent.getOrElse(Some(nodeId), Seq.empty).flatMap(c => processesNodesById.get(id(c)))
      nodeId -> TreeNode(n.data, children)
    }.toMap
    if (depth > 0) {
      buildFromBottom(depth - 1, rest, id, nodesByParent, processesNodesById ++ newProcessedNodes)
    } else {
      // top nodes
      newProcessedNodes.values.toSeq
    }
  }

  def construct[N](nodes: Seq[N], id: N => String, parent_node_id: N => Option[String]): Seq[TreeNode[N]] = {
    val nodesByParent = nodes.groupBy(parent_node_id)
    val topNodes      = nodesByParent.getOrElse(None, Seq.empty)
    val bottomToTop   = calculateNodesDepth[N](topNodes, id, nodesByParent)
    val maxDepth      = bottomToTop.headOption.map(_.depth).getOrElse(0)
    buildFromBottom(maxDepth, bottomToTop, id, nodesByParent, Map.empty)
  }
}