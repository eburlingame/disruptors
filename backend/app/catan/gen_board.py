from app.catan.board import *


def fixedBoard():
    return GameBoard(
        tiles=[
            # Outer ring
            GameTile(
                location=TileCoordinate(x=0, y=2, z=-2),
                dice_number=10,
                tile_type=TileType.ORE,
                ports=[
                    Port(vertex_index=0, resource=PortResource.ANY, ratio=3),
                    Port(vertex_index=5, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=2, z=-1),
                dice_number=12,
                tile_type=TileType.WHEAT,
                ports=[
                    Port(vertex_index=5, resource=PortResource.WOOD, ratio=2),
                    Port(vertex_index=4, resource=PortResource.WOOD, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=2, z=0),
                dice_number=9,
                tile_type=TileType.WHEAT,
                ports=[
                    Port(vertex_index=0, resource=PortResource.WOOD, ratio=2),
                    Port(vertex_index=3, resource=PortResource.BRICK, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=1, z=1),
                dice_number=8,
                tile_type=TileType.WOOD,
                ports=[
                    Port(vertex_index=4, resource=PortResource.BRICK, ratio=2),
                    Port(vertex_index=5, resource=PortResource.BRICK, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-2, y=0, z=2),
                dice_number=5,
                tile_type=TileType.BRICK,
                ports=[
                    Port(vertex_index=3, resource=PortResource.ANY, ratio=3),
                    Port(vertex_index=4, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=-1, z=2),
                dice_number=6,
                tile_type=TileType.WHEAT,
                ports=[
                    Port(vertex_index=2, resource=PortResource.ANY, ratio=3),
                    Port(vertex_index=3, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=0, y=-2, z=2),
                dice_number=11,
                tile_type=TileType.SHEEP,
                ports=[
                    Port(vertex_index=1, resource=PortResource.SHEEP, ratio=2),
                    Port(vertex_index=4, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=-2, z=1),
                dice_number=5,
                tile_type=TileType.SHEEP,
                ports=[
                    Port(vertex_index=2, resource=PortResource.SHEEP, ratio=2),
                    Port(vertex_index=3, resource=PortResource.SHEEP, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=-2, z=0),
                dice_number=8,
                tile_type=TileType.ORE,
                ports=[
                    Port(vertex_index=1, resource=PortResource.ANY, ratio=3),
                    Port(vertex_index=2, resource=PortResource.ANY, ratio=3),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=-1, z=-1),
                dice_number=10,
                tile_type=TileType.BRICK,
                ports=[
                    Port(vertex_index=0, resource=PortResource.ORE, ratio=2),
                    Port(vertex_index=1, resource=PortResource.ORE, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=2, y=0, z=-2),
                dice_number=9,
                tile_type=TileType.WOOD,
                ports=[
                    Port(vertex_index=2, resource=PortResource.ORE, ratio=2),
                    Port(vertex_index=5, resource=PortResource.WHEAT, ratio=2),
                ],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=1, z=-2),
                dice_number=2,
                tile_type=TileType.SHEEP,
                ports=[
                    Port(vertex_index=0, resource=PortResource.WHEAT, ratio=2),
                    Port(vertex_index=1, resource=PortResource.WHEAT, ratio=2),
                ],
            ),
            # Inner ring
            GameTile(
                location=TileCoordinate(x=0, y=-1, z=1),
                dice_number=6,
                tile_type=TileType.BRICK,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=1, z=0),
                dice_number=11,
                tile_type=TileType.WOOD,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=-1, y=-0, z=1),
                dice_number=3,
                tile_type=TileType.ORE,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=0, y=-1, z=1),
                dice_number=4,
                tile_type=TileType.WHEAT,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=-1, z=0),
                dice_number=3,
                tile_type=TileType.WOOD,
                ports=[],
            ),
            GameTile(
                location=TileCoordinate(x=1, y=0, z=-1),
                dice_number=4,
                tile_type=TileType.SHEEP,
                ports=[],
            ),
            # Center
            GameTile(
                location=TileCoordinate(x=0, y=0, z=0),
                dice_number=-1,
                tile_type=TileType.DESERT,
                ports=[],
            ),
        ]
    )
