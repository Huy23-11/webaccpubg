from flask import Blueprint, request, jsonify
from extensions import db
from sqlalchemy import text
from routes.auth_decorator import admin_required

hienthianhacc_bp = Blueprint("hienthianhacc_bp", __name__)

@hienthianhacc_bp.route("/hienthianhacc", methods=["POST"])
@admin_required
def hienthianhacc():
    """
    Hiển thị danh sách ảnh của acc
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
              description: Mã acc cần lấy danh sách ảnh
    responses:
      200:
        description: Lấy danh sách ảnh thành công
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            danhsachanh:
              type: array
              items:
                type: object
                properties:
                  ma_anh:
                    type: integer
                    example: 1
                  duong_dan:
                    type: string
                    example: /static/images/anhacc/5_1.jpg
    """

    data = request.get_json()
    ma_acc = data.get("ma_acc")

    query = text("""
        SELECT ma_anh, duong_dan, thu_tu
        FROM AnhAcc
        WHERE ma_acc = :ma_acc
        ORDER BY thu_tu
    """)

    result = db.session.execute(query, {"ma_acc": ma_acc}).fetchall()

    danhsachanh = [
        {"ma_anh": row[0], "duong_dan": row[1], "thu_tu": row[2]}
        for row in result
    ]

    return jsonify({
        "status": "success",
        "danhsachanh": danhsachanh
    })