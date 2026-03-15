from flask import Blueprint, request, render_template
from sqlalchemy import text
from extensions import db

dangky_bp = Blueprint("dangky_bp", __name__)

@dangky_bp.route("/dangky")
def trang_dangky():
    return render_template("dangky.html")

@dangky_bp.route("/dangky", methods=["POST"])
def dangky():
    """
    Đăng ký tài khoản người mua
    ---
    tags:
      - Auth
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            tai_khoan:
              type: string
              example: huy123
              description: Tên tài khoản
            mat_khau:
              type: string
              example: 123456
              description: Mật khẩu
    responses:
      200:
        description: Kết quả đăng ký
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
    """

    data = request.get_json()
    taikhoan = data.get("tai_khoan")
    matkhau = data.get("mat_khau")

    sql_check = """
    SELECT 1
    FROM NguoiMua
    WHERE tai_khoan = :tk
    """

    ton_tai = db.session.execute(
        text(sql_check),
        {"tk": taikhoan}
    ).fetchone()

    if ton_tai:
        return {"status":"exist"}

    sql_insert = """
    INSERT INTO NguoiMua
    (ten, email, tai_khoan, mat_khau, so_du)
    VALUES
    (:ten, :email, :tk, :mk, 0)
    """

    db.session.execute(
        text(sql_insert),
        {
            "ten": taikhoan,
            "email": taikhoan + "@shop.com",
            "tk": taikhoan,
            "mk": matkhau
        }
    )

    db.session.commit()

    return {"status":"success"}