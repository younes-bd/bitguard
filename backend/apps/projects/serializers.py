from rest_framework import serializers
from .models import Project, Task, Milestone, TimeLog


class TimeLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = TimeLog
        fields = '__all__'
        read_only_fields = ['user']

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.email

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    assignee_name = serializers.SerializerMethodField()
    total_logged_hours = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = '__all__'

    def get_assignee_name(self, obj):
        if obj.assignee:
            return obj.assignee.get_full_name() or obj.assignee.email
        return None

    def get_total_logged_hours(self, obj):
        return float(sum(l.hours for l in obj.time_logs.all()))


class MilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Milestone
        fields = '__all__'


class ProjectListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for project list views."""
    client_name = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()
    task_count = serializers.SerializerMethodField()
    done_count = serializers.SerializerMethodField()
    progress = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'project_type', 'status', 'priority',
            'client_name', 'manager_name', 'start_date', 'deadline',
            'budget', 'progress', 'task_count', 'done_count', 'created_at',
        ]

    def get_client_name(self, obj):
        return obj.client.name if obj.client else 'Internal'

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.get_full_name() or obj.manager.email
        return None

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_done_count(self, obj):
        return obj.tasks.filter(status='done').count()


class ProjectDetailSerializer(serializers.ModelSerializer):
    """Full serializer with nested tasks and milestones."""
    tasks = TaskSerializer(many=True, read_only=True)
    milestones = MilestoneSerializer(many=True, read_only=True)
    progress = serializers.ReadOnlyField()
    client_name = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_client_name(self, obj):
        return obj.client.name if obj.client else 'Internal'
