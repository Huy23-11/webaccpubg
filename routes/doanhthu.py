from flask import Blueprint, render_template, session, redirect
from extensions import db
from sqlalchemy import text
from extensions import socketio
from routes.auth_decorator import admin_required

doanhthu_bp = Blueprint("doanhthu_bp", __name__)

@doanhthu_bp.route("/doanhthu")
def thongke_doanhthu():
    if "role" not in session or session["role"] != "admin":
        return redirect("/dangnhap")
    #acc bán tháng này
    sql_ban_thang = """
        SELECT COUNT(*) 
        FROM DonMuaAcc
        WHERE MONTH(thoi_diem) = MONTH(GETDATE())
        AND YEAR(thoi_diem) = YEAR(GETDATE())
    """
    ban_thang = db.session.execute(text(sql_ban_thang)).scalar()

    #acc bán hôm nay
    sql_ban_homnay = """
        SELECT COUNT(*)
        FROM DonMuaAcc
        WHERE CAST(thoi_diem AS DATE) = CAST(GETDATE() AS DATE)
    """
    ban_homnay = db.session.execute(text(sql_ban_homnay)).scalar()

    #nạp tháng này
    sql_nap_thang = """
        SELECT ISNULL(SUM(so_tien),0)
        FROM DonNapTien
        WHERE trang_thai = 'SUCCESS'
        AND MONTH(thoi_diem) = MONTH(GETDATE())
        AND YEAR(thoi_diem) = YEAR(GETDATE())
    """
    nap_thang = db.session.execute(text(sql_nap_thang)).scalar()

    #nạp hôm nay
    sql_nap_homnay = """
        SELECT ISNULL(SUM(so_tien),0)
        FROM DonNapTien
        WHERE trang_thai = 'SUCCESS'
        AND CAST(thoi_diem AS DATE) = CAST(GETDATE() AS DATE)
    """
    nap_homnay = db.session.execute(text(sql_nap_homnay)).scalar()

    return render_template(
        "doanhthu.html",
        ban_thang=ban_thang,
        ban_homnay=ban_homnay,
        nap_thang=nap_thang,
        nap_homnay=nap_homnay
    )

#đã bán theo tuần -----------------------------------------------
@doanhthu_bp.route("/api/daban-theotuan")
@admin_required
def daban_theotuan():
    """
    Thống kê số acc đã bán theo tuần hiện tại
    ---
    tags:
      - ThongKe
    security:
      - Bearer: []
    responses:
      200:
        description: Danh sách số acc bán theo từng ngày trong tuần
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                type: integer
              example: [3,5,2,0,1,4,2]
    """
    sql = """
    DECLARE @Today DATE = GETDATE();
    DECLARE @Monday DATE = DATEADD(DAY, - (DATEDIFF(DAY, '19000101', @Today) % 7), @Today);
    DECLARE @Sunday DATE = DATEADD(DAY, 6, @Monday);
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        COUNT(*) AS soluong
    FROM DonMuaAcc
    WHERE CAST(thoi_diem AS DATE) >= @Monday
    AND CAST(thoi_diem AS DATE) <= @Sunday
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = r.soluong
    return {"data": data}

def emit_update_dabantheotuan():
    sql = """
    DECLARE @Today DATE = GETDATE();
    DECLARE @Monday DATE = DATEADD(DAY, - (DATEDIFF(DAY, '19000101', @Today) % 7), @Today);
    DECLARE @Sunday DATE = DATEADD(DAY, 6, @Monday);
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        COUNT(*) AS soluong
    FROM DonMuaAcc
    WHERE CAST(thoi_diem AS DATE) >= @Monday
    AND CAST(thoi_diem AS DATE) <= @Sunday
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = r.soluong
    socketio.emit("update_dabantheotuan", {"data": data})

#doanh thu theo tuần -------------------------------------------------
@doanhthu_bp.route("/api/doanhthu-theotuan")
@admin_required
def doanhthu_theotuan():
    """
    Thống kê doanh thu nạp tiền theo tuần hiện tại
    ---
    tags:
      - ThongKe
    security:
      - Bearer: []
    responses:
      200:
        description: Doanh thu theo từng ngày trong tuần (triệu đồng)
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                type: number
              example: [5,10,0,2,3,8,1]
    """
    sql = """
    DECLARE @Today DATE = GETDATE();
    DECLARE @Monday DATE = DATEADD(DAY, - (DATEDIFF(DAY, '19000101', @Today) % 7), @Today);
    DECLARE @Sunday DATE = DATEADD(DAY, 6, @Monday);
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE CAST(thoi_diem AS DATE) >= @Monday
    AND CAST(thoi_diem AS DATE) <= @Sunday
    AND trang_thai = 'SUCCESS'
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = float(r.tongtien//1000000)
    print(data)
    return {"data": data}

def emit_update_doanhthutheotuan():
    sql = """
    DECLARE @Today DATE = GETDATE();
    DECLARE @Monday DATE = DATEADD(DAY, - (DATEDIFF(DAY, '19000101', @Today) % 7), @Today);
    DECLARE @Sunday DATE = DATEADD(DAY, 6, @Monday);
    SELECT 
        DATEPART(WEEKDAY, thoi_diem) AS thu,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE CAST(thoi_diem AS DATE) >= @Monday
    AND CAST(thoi_diem AS DATE) <= @Sunday
    AND trang_thai = 'SUCCESS'
    GROUP BY DATEPART(WEEKDAY, thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*7
    for r in result:
        thu = (r.thu + 5) % 7
        data[thu] = float(r.tongtien//1000000)
    print("===========================================================================")
    print(data)
    socketio.emit("update_doanhthutheotuan", {"data": data})

#doanh thu theo năm----------------------
@doanhthu_bp.route("/api/doanhthu-theonam")
@admin_required
def doanhthu_theonam():
    """
    Thống kê doanh thu nạp tiền theo từng tháng trong năm
    ---
    tags:
      - ThongKe
    security:
      - Bearer: []
    responses:
      200:
        description: Doanh thu theo từng tháng (triệu đồng)
        schema:
          type: object
          properties:
            data:
              type: array
              items:
                type: number
              example: [12,8,15,20,10,5,0,0,0,0,0,0]
    """
    sql = """
    SELECT 
        MONTH(thoi_diem) AS thang,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE YEAR(thoi_diem) = YEAR(GETDATE())
    AND trang_thai = 'SUCCESS'
    GROUP BY MONTH(thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*12
    for r in result:
        thang = r.thang - 1
        data[thang] = float(r.tongtien//1000000)
    return {"data": data}

def emit_update_doanhthutheonam():
    sql = """
    SELECT 
        MONTH(thoi_diem) AS thang,
        SUM(so_tien) AS tongtien
    FROM DonNapTien
    WHERE YEAR(thoi_diem) = YEAR(GETDATE())
    AND trang_thai = 'SUCCESS'
    GROUP BY MONTH(thoi_diem)
    """
    result = db.session.execute(text(sql))
    data = [0]*12
    for r in result:
        thang = r.thang - 1
        data[thang] = float(r.tongtien//1000000)
    socketio.emit("update_doanhthutheonam", {"data": data})