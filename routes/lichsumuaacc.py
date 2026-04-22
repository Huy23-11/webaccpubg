from flask import Blueprint,request, render_template, session, redirect, jsonify
from sqlalchemy import text
from extensions import db

lichsumuaacc_bp = Blueprint("lichsumuaacc_bp", __name__)

@lichsumuaacc_bp.route("/lichsumuaacc")
def lichsumuaacc():
  if "ma_nguoi_mua" not in session:
    return redirect("/dangnhap")

  ma = session["ma_nguoi_mua"]
  data = get_data(ma)

  return render_template(
    "lichsumuaacc.html",
    dsacc=data["dsacc"],
    soluong=data["soluong"],
    gia_max=data["gia_max"],
    datieu=data["datieu"],
    vip=data["vip"]
  )

@lichsumuaacc_bp.route("/api/lichsumuaacc", methods=["GET"])
def api_lichsumuaacc():
  """
  API lịch sử mua acc
  ---
  tags:
    - Người mua - Lịch sử
  parameters:
    - name: ma_nguoi_mua
      in: query
      type: integer
      required: true
      example: 1
  responses:
    200:
      description: Lấy lịch sử mua thành công
      schema:
        type: object
        properties:
          dsacc:
            type: array
            items:
              type: object
              properties:
                ma_acc:
                  type: integer
                gia:
                  type: number
                tai_khoan:
                  type: string
                mat_khau:
                  type: string
                thoi_diem:
                  type: string
          soluong:
            type: integer
          gia_max:
            type: number
  """

  ma = request.args.get("ma_nguoi_mua")
  data = get_data(ma)

  return jsonify(data)

def get_data(ma):
  sql = """
    SELECT 
      a.ma_acc, a.gia, a.tai_khoan, a.mat_khau,
      d.thoi_diem, aa.duong_dan
    FROM DonMuaAcc d
    LEFT JOIN AnhAcc aa ON aa.ma_acc = d.ma_acc AND aa.thu_tu=1
    JOIN Acc a ON d.ma_acc = a.ma_acc
    WHERE d.ma_nguoi_mua = :ma
    ORDER BY d.thoi_diem DESC
  """

  rows = db.session.execute(text(sql), {"ma": ma}).fetchall()

  dsacc = []
  for row in rows:
    dsacc.append({
      "ma_acc": row.ma_acc,
      "gia": row.gia,
      "tai_khoan": row.tai_khoan,
      "mat_khau": row.mat_khau,
      "thoi_diem": row.thoi_diem,
      "duong_dan": row.duong_dan
    })

  soluong = len(dsacc)
  gia_max = max([acc["gia"] for acc in dsacc], default=0)
  datieu = sum(acc["gia"] for acc in dsacc)
  vip = 0
  if "ma_nguoi_mua" in session:
    ma_nguoi_mua = session["ma_nguoi_mua"]
    sqlvip = """
      SELECT vip
      FROM NguoiMua
      WHERE ma_nguoi_mua = :ma
    """
    vip = db.session.execute(text(sqlvip), {"ma": ma_nguoi_mua}).scalar()
  return {
    "dsacc": dsacc,
    "soluong": soluong,
    "gia_max": gia_max,
    "datieu": datieu,
    "vip": vip
  }