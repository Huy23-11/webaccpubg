from flask import Blueprint, request, redirect, session
from extensions import db
from sqlalchemy import text

muaacc_bp = Blueprint("muaacc_bp",__name__)

@muaacc_bp.route("/muaacc",methods = ["POST"])
def muaacc():
    """
    Mua acc
    ---
    tags:
      - MuaAcc
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_nguoi_mua:
              type: integer
              example: 3
              description: Mã người mua
            ma_acc:
              type: integer
              example: 10
              description: Mã acc cần mua
    responses:
      200:
        description: Kết quả mua acc
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma_nguoi_mua = data.get("ma_nguoi_mua")
    ma_acc = data.get("ma_acc")

    if "ma_nguoi_mua" not in session:
        return {"status": "unlogin"}

    sql1 = """
        SELECT nm.so_du
        FROM NguoiMua nm
        WHERE ma_nguoi_mua = :ma
    """
    rs = db.session.execute(text(sql1),{"ma": ma_nguoi_mua}).fetchone()
    sodu = rs[0]

    sql2 = """
        SELECT a.gia
        FROM Acc a
        WHERE ma_acc = :ma
    """
    rs = db.session.execute(text(sql2),{"ma": ma_acc}).fetchone()
    gia = rs[0]

    if sodu >= gia:

        sql3 = """
            UPDATE NguoiMua
            SET so_du = so_du - :gia
            WHERE ma_nguoi_mua = :ma
        """
        db.session.execute(text(sql3), {"gia": gia, "ma": ma_nguoi_mua})

        sql4 = """
            UPDATE ACC
            SET trang_thai = 'SOLD'
            WHERE ma_acc = :ma
        """
        db.session.execute(text(sql4), {"ma": ma_acc})

        sql5 = """
            INSERT INTO DonMuaAcc(ma_acc, ma_nguoi_mua)
            VALUES (:ma_acc, :ma_nguoi_mua)
        """
        db.session.execute(text(sql5),{"ma_acc": ma_acc,"ma_nguoi_mua": ma_nguoi_mua})

        db.session.commit()

        session["so_du"] = float(sodu - gia)

        return {"status": "success"}

    return {"status":"fail"}