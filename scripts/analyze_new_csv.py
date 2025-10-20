import requests
import csv
from io import StringIO

# CSV 파일 URL
csv_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sites%20%281%29-2sjEDaJSEze0Zhq8NiNHdxB4FM1U5n.csv"

print("[v0] CSV 파일 다운로드 중...")

# 여러 인코딩 시도
encodings = ['utf-8', 'utf-8-sig', 'euc-kr', 'cp949', 'latin-1']

for encoding in encodings:
    try:
        response = requests.get(csv_url)
        response.raise_for_status()
        
        # 인코딩 시도
        content = response.content.decode(encoding)
        
        print(f"\n[v0] ✓ {encoding} 인코딩으로 성공적으로 읽음")
        
        # CSV 파싱
        csv_reader = csv.reader(StringIO(content))
        rows = list(csv_reader)
        
        if len(rows) > 0:
            print(f"\n[v0] 총 행 수: {len(rows)}")
            print(f"\n[v0] 헤더 (첫 번째 행):")
            headers = rows[0]
            for i, header in enumerate(headers):
                print(f"  {i+1}. [{chr(65+i)}열] {header}")
            
            print(f"\n[v0] 샘플 데이터 (2-4번째 행):")
            for row_idx in range(1, min(4, len(rows))):
                print(f"\n  행 {row_idx}:")
                for i, value in enumerate(rows[row_idx]):
                    if i < len(headers):
                        print(f"    {headers[i]}: {value}")
            
            # 통계 수집
            print(f"\n[v0] 데이터 통계:")
            
            # 월 열 찾기 (J열, 인덱스 9)
            if len(headers) > 9:
                month_col_idx = 9
                months = set()
                for row in rows[1:]:
                    if len(row) > month_col_idx and row[month_col_idx]:
                        months.add(row[month_col_idx])
                print(f"  월 (J열, 인덱스 {month_col_idx}): {sorted(months)}")
            
            # 연 열 찾기 (K열, 인덱스 10)
            if len(headers) > 10:
                year_col_idx = 10
                years = set()
                for row in rows[1:]:
                    if len(row) > year_col_idx and row[year_col_idx]:
                        years.add(row[year_col_idx])
                print(f"  연 (K열, 인덱스 {year_col_idx}): {sorted(years)}")
            
            # 현장 구분 (L열, 인덱스 11)
            if len(headers) > 11:
                scale_col_idx = 11
                scales = set()
                for row in rows[1:]:
                    if len(row) > scale_col_idx and row[scale_col_idx]:
                        scales.add(row[scale_col_idx])
                print(f"  현장 구분/규모 (L열, 인덱스 {scale_col_idx}): {sorted(scales)}")
            
            # 업태 (M열, 인덱스 12)
            if len(headers) > 12:
                business_col_idx = 12
                businesses = set()
                for row in rows[1:]:
                    if len(row) > business_col_idx and row[business_col_idx]:
                        businesses.add(row[business_col_idx])
                print(f"  업태 (M열, 인덱스 {business_col_idx}): {sorted(businesses)}")
            
            # 지역 (Q열, 인덱스 16)
            if len(headers) > 16:
                region_col_idx = 16
                regions = set()
                for row in rows[1:]:
                    if len(row) > region_col_idx and row[region_col_idx]:
                        regions.add(row[region_col_idx])
                print(f"  지역 (Q열, 인덱스 {region_col_idx}): {sorted(regions)}")
            
            # 절감률 샘플 (P열, 인덱스 15)
            if len(headers) > 15:
                rate_col_idx = 15
                print(f"\n  절감률 샘플 (P열, 인덱스 {rate_col_idx}):")
                for row_idx in range(1, min(6, len(rows))):
                    if len(rows[row_idx]) > rate_col_idx:
                        print(f"    행 {row_idx}: {rows[row_idx][rate_col_idx]}")
        
        break  # 성공하면 루프 종료
        
    except UnicodeDecodeError:
        print(f"[v0] ✗ {encoding} 인코딩 실패")
        continue
    except Exception as e:
        print(f"[v0] ✗ {encoding} 인코딩 에러: {str(e)}")
        continue

print("\n[v0] 분석 완료")
