from rest_framework import serializers
from apps.hr_attendance.domain.models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
        read_only_fields = ('tenant', 'created_at', 'updated_at', 'created_by', 'updated_by')

