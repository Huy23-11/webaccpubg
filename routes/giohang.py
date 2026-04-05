from flask import Blueprint, request, render_template, session, redirect, jsonify
from sqlalchemy import text
from extensions import db

giohang_bp = Blueprint("giohang", __name__)

@giohang_bp.route("/giohang")
def giohang():
  if "ma_nguoi_mua" not in session:
    return redirect("/dangnhap")

  ma = session["ma_nguoi_mua"]
  data = get_data(ma)

  return render_template(
    "giohang.html",
    dsacc=data["dsacc"],
    soluong=data["soluong"],
    gia_max=data["gia_max"]
  )

@giohang_bp.route("/api/giohang", methods=["GET"])
def api_giohang():
  """
  API lấy giỏ hàng của người mua
  ---
  tags:
    - Người mua - Giỏ hàng
  parameters:
    - name: ma_nguoi_mua
      in: query
      type: integer
      required: true
      example: 1
  responses:
    200:
      description: Lấy giỏ hàng thành công
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
                thoi_diem:
                  type: string
                gia:
                  type: number
                trang_thai:
                  type: string
          soluong:
            type: integer
  """

  ma = request.args.get("ma_nguoi_mua")
  data = get_data(ma)

  return jsonify(data)

def get_data(ma):
  sql = """
    SELECT 
      g.ma_acc,
      CAST(g.thoi_diem AS DATE) as thoi_diem,
      a.gia,
      a.trang_thai,
      aa.duong_dan
    FROM AccTrongGio g
    LEFT JOIN AnhAcc aa ON aa.ma_acc = g.ma_acc AND aa.thu_tu=1
    JOIN Acc a ON g.ma_acc = a.ma_acc
    WHERE g.ma_nguoi_mua = :ma
    ORDER BY g.ma_acc DESC
  """

  rows = db.session.execute(text(sql), {"ma": ma}).fetchall()

  dsacc = []
  for row in rows:
    dsacc.append({
      "ma_acc": row.ma_acc,
      "thoi_diem": row.thoi_diem,
      "gia": row.gia,
      "trang_thai": row.trang_thai,
      "duong_dan": row.duong_dan
    })
  gia_max = max([acc["gia"] for acc in dsacc], default=0)
  return {
    "dsacc": dsacc,
    "soluong": len(dsacc),
    "gia_max": gia_max
  }