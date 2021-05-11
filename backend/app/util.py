import uuid, random


def gen_uuid():
    return str(uuid.uuid4())


alphabet = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split()


def gen_room_code():
    return "".join([random.choice(alphabet) for i in range(4)])
