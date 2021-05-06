from app.catan.board import *


def fixedBoard():
    return GameBoard(
        tiles=[
            # Outer ring
            GameTile(
                location=TileCoordinate(x=0, y=2, z=-2),
                diceNumber=10,
                tileType=TileType.ORE,
                ports=[
                    Port(vertexIndex=0, resource=PortResource.ANY, ratio=3),
                    Port(vertexIndex=5, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=2, z=-1),
                diceNumber=12,
                tileType=TileType.WHEAT,
                ports=[
                    Port(vertexIndex=5, resource=PortResource.WOOD, ratio=2),
                    Port(vertexIndex=4, resource=PortResource.WOOD, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=2, z=0),
                diceNumber=9,
                tileType=TileType.WHEAT,
                ports=[
                    Port(vertexIndex=0, resource=PortResource.WOOD, ratio=2),
                    Port(vertexIndex=3, resource=PortResource.BRICK, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=1, z=1),
                diceNumber=8,
                tileType=TileType.WOOD,
                ports=[
                    Port(vertexIndex=4, resource=PortResource.BRICK, ratio=2),
                    Port(vertexIndex=5, resource=PortResource.BRICK, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=0, z=2),
                diceNumber=5,
                tileType=TileType.BRICK,
                ports=[
                    Port(vertexIndex=3, resource=PortResource.ANY, ratio=3),
                    Port(vertexIndex=4, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=-1, z=2),
                diceNumber=6,
                tileType=TileType.WHEAT,
                ports=[
                    Port(vertexIndex=2, resource=PortResource.ANY, ratio=3),
                    Port(vertexIndex=3, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=0, y=-2, z=2),
                diceNumber=11,
                tileType=TileType.SHEEP,
                ports=[
                    Port(vertexIndex=1, resource=PortResource.SHEEP, ratio=2),
                    Port(vertexIndex=4, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=-2, z=1),
                diceNumber=5,
                tileType=TileType.SHEEP,
                ports=[
                    Port(vertexIndex=2, resource=PortResource.SHEEP, ratio=2),
                    Port(vertexIndex=3, resource=PortResource.SHEEP, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=-2, z=0),
                diceNumber=8,
                tileType=TileType.ORE,
                ports=[
                    Port(vertexIndex=1, resource=PortResource.ANY, ratio=3),
                    Port(vertexIndex=2, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=-1, z=-1),
                diceNumber=10,
                tileType=TileType.BRICK,
                ports=[
                    Port(vertexIndex=0, resource=PortResource.ORE, ratio=2),
                    Port(vertexIndex=1, resource=PortResource.ORE, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=0, z=-2),
                diceNumber=9,
                tileType=TileType.WOOD,
                ports=[
                    Port(vertexIndex=2, resource=PortResource.ORE, ratio=2),
                    Port(vertexIndex=5, resource=PortResource.WHEAT, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=1, z=-2),
                diceNumber=2,
                tileType=TileType.SHEEP,
                ports=[
                    Port(vertexIndex=0, resource=PortResource.WHEAT, ratio=2),
                    Port(vertexIndex=1, resource=PortResource.WHEAT, ratio=2),
                ],
            ),
            # Inner ring
            GameTile(
                location=TileCoordinate(x=0, y=-1, z=1),
                diceNumber=6,
                tileType=TileType.BRICK,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=1, z=0),
                diceNumber=11,
                tileType=TileType.WOOD,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=-0, z=1),
                diceNumber=3,
                tileType=TileType.ORE,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=0, y=-1, z=1),
                diceNumber=4,
                tileType=TileType.WHEAT,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=-1, z=0),
                diceNumber=3,
                tileType=TileType.WOOD,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=0, z=-1),
                diceNumber=4,
                tileType=TileType.SHEEP,
                ports=[],
            ),
            # Center
            GameTile(
                location=TileCoordinate(x=0, y=0, z=0),
                diceNumber=-1,
                tileType=TileType.DESERT,
                ports=[],
            ),
        ]
    )
