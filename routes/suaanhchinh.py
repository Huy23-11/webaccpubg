from flask import request, Blueprint
from sqlalchemy import text
from extensions import db

suaanhchinh_bp = Blueprint("suaanhchinh_bp", __name__)

@suaanhchinh_bp.route("/datanhchinh", methods=["POST"])
def data_anh_chinh():
    data = request.get_json()
    ma_anh = data.get("ma_anh")

    # 1. Lấy thông tin ảnh được click
    sql1 = """
        SELECT ma_acc, thu_tu
        FROM AnhAcc
        WHERE ma_anh = :ma_anh
    """
    row = db.session.execute(text(sql1), {
        "ma_anh": ma_anh
    }).fetchone()

    if not row:
        return {"status": "fail"}

    ma_acc = row.ma_acc
    thu_tu_click = row.thu_tu

    # ❌ Nếu đã là ảnh chính thì thôi
    if thu_tu_click == 1:
        return {"status": "fail"}

    # 2. Lấy ảnh chính hiện tại (nếu có)
    sql2 = """
        SELECT ma_anh, thu_tu
        FROM AnhAcc
        WHERE ma_acc = :ma_acc AND thu_tu = 1
    """
    anh_chinh = db.session.execute(text(sql2), {
        "ma_acc": ma_acc
    }).fetchone()

    # 🔥 CASE 1: Chưa có ảnh chính → set luôn
    if not anh_chinh:
        sql_set = """
            UPDATE AnhAcc
            SET thu_tu = 1
            WHERE ma_anh = :ma_anh
        """
        db.session.execute(text(sql_set), {
            "ma_anh": ma_anh
        })

        db.session.commit()
        return {"status": "success"}

    # 🔥 CASE 2: Có ảnh chính → swap

    # ảnh chính → xuống vị trí cũ của ảnh click
    sql3 = """
        UPDATE AnhAcc
        SET thu_tu = :thu_tu_click
        WHERE ma_anh = :ma_anh_chinh
    """
    db.session.execute(text(sql3), {
        "thu_tu_click": thu_tu_click,
        "ma_anh_chinh": anh_chinh.ma_anh
    })

    # ảnh click → lên làm ảnh chính
    sql4 = """
        UPDATE AnhAcc
        SET thu_tu = 1
        WHERE ma_anh = :ma_anh
    """
    db.session.execute(text(sql4), {
        "ma_anh": ma_anh
    })

    db.session.commit()

    return {"status": "success"}