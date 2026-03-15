from flask import request, Blueprint, session
from extensions import db
from sqlalchemy import text

themgiohang_bp = Blueprint("themgiohang_bp",__name__)

@themgiohang_bp.route("/themgiohang",methods=["POST"])
def themgiohang():
    """
    Thêm acc vào giỏ hàng
    ---
    tags:
      - GioHang
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
              description: Mã acc cần thêm vào giỏ
    responses:
      200:
        description: Kết quả thêm acc vào giỏ
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    if "ma_nguoi_mua" not in session:
        return {"status": "unlogin"}

    data = request.get_json()
    ma_nguoi_mua = data.get("ma_nguoi_mua")
    ma_acc = data.get("ma_acc")

    sql = """
        SELECT * 
        FROM AccTrongGio
        WHERE ma_nguoi_mua = :x
        AND ma_acc = :y
    """

    acctronggio = db.session.execute(
        text(sql),
        {"x": ma_nguoi_mua, "y": ma_acc}
    ).fetchone()

    if acctronggio:
        return {"status": "exist"}

    sql1 = """
        INSERT INTO AccTrongGio(ma_nguoi_mua, ma_acc)
        VALUES (:x, :y)
    """

    db.session.execute(text(sql1), {"x": ma_nguoi_mua, "y": ma_acc})
    db.session.commit()

    return {"status": "success"}