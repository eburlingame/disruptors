import uuid, random


def gen_uuid():
    return str(uuid.uuid4())


alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split()


def gen_game_code():
    return "".join([random.choice(alphabet) for i in range(4)])
