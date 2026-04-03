from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
from routes.auth_decorator import admin_required

suatrangthaitimkiemacc_bp = Blueprint("suatrangthaitimkiemacc", __name__)

@suatrangthaitimkiemacc_bp.route("/suatrangthaitimkiemacc", methods=["POST"])
@admin_required
def suatrangthaitimkiemacc():
    """
    Cập nhật trạng thái tìm kiếm của acc (sieu_xe, bape, mu_dinh, gang_tay)
    ---
    tags:
      - Acc
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            ma_acc:
              type: integer
              example: 5
            trang_thai:
              type: array
              items:
                type: integer
              example: [1,0,1,0]
              description: |
                Mảng trạng thái gồm 4 phần tử:
                [sieu_xe, bape, mu_dinh, gang_tay]
    responses:
      200:
        description: Cập nhật trạng thái thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    ma_acc = data.get("ma_acc")
    trang_thai = data.get("trang_thai")

    sql_update = """
        UPDATE Acc
        SET sieu_xe = :x,
            bape = :y,
            mu_dinh = :z,
            gang_tay = :w
        WHERE ma_acc = :ma_acc
    """

    db.session.execute(
        text(sql_update),
        {
            "x": trang_thai[0],
            "y": trang_thai[1],
            "z": trang_thai[2],
            "w": trang_thai[3],
            "ma_acc": ma_acc
        }
    )

    db.session.commit()

    return jsonify({"status": "success"})